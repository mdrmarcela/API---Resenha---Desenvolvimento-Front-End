// src/components/ReCaptcha.jsx
import { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// Lê o tema atual do Bootstrap a partir do <html>
const getBootstrapTheme = () => {
    if (typeof document === "undefined") return "light";

    const html = document.documentElement;
    const attr = html.getAttribute("data-bs-theme");

    // Qualquer coisa diferente de "dark" tratamos como "light"
    return attr === "dark" ? "dark" : "light";
};

const ReCaptcha = ({ setCaptchaToken, loading }) => {
    const [recaptchaTheme, setRecaptchaTheme] = useState(getBootstrapTheme());
    const wrapperRef = useRef(null);
    const recaptchaRef = useRef(null); // acesso ao widget p/ reset()
    const prevLoadingRef = useRef(false);

    // Mantém o tema sincronizado com <html data-bs-theme="...">
    useEffect(() => {
        const updateTheme = () => {
            setRecaptchaTheme(getBootstrapTheme());
        };

        // 1) Sincroniza imediatamente após o mount
        updateTheme();

        // 2) Observa mudanças futuras no atributo data-bs-theme
        const obs = new MutationObserver(updateTheme);
        obs.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-bs-theme"],
        });

        return () => obs.disconnect();
    }, []);

    // Remove borda padrão do iframe do reCAPTCHA
    useEffect(() => {
        if (!wrapperRef.current) return;

        const apply = () => {
            const iframe = wrapperRef.current.querySelector(
                "iframe[src*='recaptcha']"
            );
            if (!iframe) return;
            iframe.style.border = "none";
            iframe.style.borderRadius = "0";
        };

        apply();

        const mo = new MutationObserver(apply);
        mo.observe(wrapperRef.current, { childList: true, subtree: true });

        return () => mo.disconnect();
    }, [recaptchaTheme]);

    // OBSERVA o ciclo de loading do formulário:
    // quando loading muda de true → false, significa que a tentativa de login terminou
    // (com sucesso OU erro). Nesse momento, descartamos o token e resetamos o widget.
    useEffect(() => {
        const prev = prevLoadingRef.current;
        if (prev && !loading) {
            // terminou uma tentativa
            if (recaptchaRef.current) {
                try {
                    recaptchaRef.current.reset(); // visualmente "desmarca"
                } catch (e) {
                    console.warn("Falha ao resetar reCAPTCHA:", e);
                }
            }
            setCaptchaToken(null); // impede reutilizar o token
        }
        prevLoadingRef.current = loading;
    }, [loading, setCaptchaToken]);

    const handleCaptchaChange = (token) => {
        // Token novo emitido pelo Google → envia pro pai
        setCaptchaToken(token);
    };

    const handleCaptchaExpired = () => {
        // Token expirou → invalida no estado do pai
        setCaptchaToken(null);
    };

    const handleCaptchaErrored = () => {
        // Erro no widget → força o usuário a refazer o desafio
        setCaptchaToken(null);
    };

    // Cores principais
    const bgColor = recaptchaTheme === "dark" ? "#222" : "#f9f9f9";

    // Parametrização da “moldura”
    const FRAME_PADDING = 8;     // quanto o container é maior que o recaptcha
    const OVERLAY_INSET = 4;     // quão “pra dentro” começa o overlay
    const FRAME_THICKNESS = 10;  // espessura da borda interna opaca

    // Container que envolve o iframe (um pouco maior que o reCAPTCHA)
    const containerStyle = {
        display: "inline-block",
        position: "relative",
        lineHeight: 0,
        overflow: "hidden",
        backgroundColor: bgColor,
        paddingTop: `${FRAME_PADDING}px`,
        paddingRight: `${FRAME_PADDING}px`,
        paddingBottom: `${FRAME_PADDING}px`,
        paddingLeft: `${FRAME_PADDING + 2}px`,
    };

    // Wrapper externo (apenas para respeitar o layout com padding BootStrap)
    const outerWrapperStyle = {
        borderRadius: "0.9rem",
        overflow: "hidden",
        backgroundColor: bgColor,
        display: "inline-block",
        lineHeight: 0,
    };

    // Overlay por cima do recaptcha:
    // - centro transparente (mostra o widget)
    // - borda interna opaca que "come" as laterais/anti-alias
    const overlayStyle = {
        position: "absolute",
        inset: OVERLAY_INSET,
        pointerEvents: "none",
        boxShadow: `0 0 0 ${FRAME_THICKNESS}px ${bgColor} inset`,
    };

    return (
        <div className="my-2">
            <div>
                <div className="form-label">Google Captcha</div>
            </div>
            <div className="p-1" style={outerWrapperStyle}>
                <div id="id-google-captcha" ref={wrapperRef} style={containerStyle}>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        key={recaptchaTheme}
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={handleCaptchaChange}
                        onExpired={handleCaptchaExpired}
                        onErrored={handleCaptchaErrored}
                        theme={recaptchaTheme}
                    />

                    {/* Overlay oca com bordas internas arredondadas e opacas */}
                    <div id="overlay" style={overlayStyle} />
                </div>
            </div>

            <div className="form-text text-body">
                Isso ajuda a proteger sua conta contra acessos automatizados.
            </div>
        </div>
    );
};

export default ReCaptcha;
