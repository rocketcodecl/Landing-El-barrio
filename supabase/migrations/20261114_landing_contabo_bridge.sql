-- Puente independiente Contabo -> Supabase; el token real reside exclusivamente en el servidor.

ALTER TABLE landing_bridge_private.bridge_secrets DROP CONSTRAINT bridge_secrets_id_check;

ALTER TABLE landing_bridge_private.bridge_secrets ADD CONSTRAINT bridge_secrets_id_check CHECK (id IN (1,2));

CREATE OR REPLACE FUNCTION public.mirror_landing_registration_contabo(p_payload jsonb, p_token text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
 v_hash text;
 v_role text := btrim(coalesce(p_payload->>'participantType',''));
 v_name text := btrim(coalesce(p_payload->>'nombre',''));
 v_email text := lower(btrim(coalesce(p_payload->>'correo','')));
 v_phone text := btrim(coalesce(p_payload->>'whatsapp',''));
 v_comuna text := btrim(coalesce(p_payload->>'comuna',''));
 v_business text := btrim(coalesce(p_payload->>'nombreNegocio',''));
 v_category text := btrim(coalesce(p_payload->>'rubro',''));
 v_reason text;
 v_id uuid;
BEGIN
 SELECT token_sha256 INTO v_hash FROM landing_bridge_private.bridge_secrets WHERE id=2;
 IF v_hash IS NULL OR coalesce(encode(sha256(convert_to(p_token,'UTF8')),'hex'),'') <> v_hash THEN
   RAISE EXCEPTION 'Acceso denegado' USING ERRCODE='42501';
 END IF;
 IF v_role NOT IN ('vecino','comercio','servicio') THEN
   RAISE EXCEPTION 'Tipo de registro inválido' USING ERRCODE='22023';
 END IF;
 IF length(v_name)<2 OR length(v_name)>160 OR length(v_email)>200 OR
    v_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR
    length(v_phone)<8 OR length(v_phone)>30 OR length(v_comuna)<2 OR length(v_comuna)>120 THEN
   RAISE EXCEPTION 'Datos de inscripción inválidos' USING ERRCODE='22023';
 END IF;
 IF v_role='comercio' AND (length(v_business)<2 OR length(v_business)>180 OR length(v_category)<2 OR length(v_category)>180) THEN
   RAISE EXCEPTION 'Comercio y rubro requeridos' USING ERRCODE='22023';
 END IF;
 IF v_role='servicio' AND (length(v_category)<2 OR length(v_category)>180) THEN
   RAISE EXCEPTION 'Servicio requerido' USING ERRCODE='22023';
 END IF;
 v_reason := 'Inscripción landing · ' || initcap(v_role);
 SELECT id INTO v_id FROM public.contact_requests
  WHERE email=v_email AND reason=v_reason ORDER BY created_at DESC LIMIT 1;
 IF v_id IS NOT NULL THEN RETURN v_id; END IF;
 INSERT INTO public.contact_requests(name,email,reason,message,status)
 VALUES(v_name,v_email,v_reason,
   concat_ws(E'\n','Tipo: '||v_role,'Comuna: '||v_comuna,'WhatsApp: '||v_phone,
     CASE WHEN v_role='comercio' THEN 'Comercio: '||v_business END,
     CASE WHEN v_role<>'vecino' THEN 'Rubro/servicio: '||v_category END,
     'Origen: https://elbarrio.lat/'), 'new')
 RETURNING id INTO v_id;
 RETURN v_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.mirror_landing_registration_contabo(jsonb,text) FROM PUBLIC, authenticated;

GRANT EXECUTE ON FUNCTION public.mirror_landing_registration_contabo(jsonb,text) TO anon;
