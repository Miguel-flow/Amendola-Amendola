function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'pt',
        includedLanguages: 'pt,en,es',
        autoDisplay: false
    }, 'google_translate_element');
}

function translatePage(lang) {
    const langMap = {
        'pt': 'Português',
        'en': 'English',
        'es': 'Español'
    };

    const tryChange = () => {
        const selectField = document.querySelector("select.goog-te-combo");
        if (selectField) {
            selectField.value = lang;
            selectField.dispatchEvent(new Event('change'));
            document.getElementById('current-lang').innerText = langMap[lang];
            localStorage.setItem("site_lang", lang);
        } else {
            setTimeout(tryChange, 500); // espera o Google carregar
        }
    };

    tryChange();
}

document.addEventListener("DOMContentLoaded", function(){
    const savedLang = localStorage.getItem("site_lang");
    if(savedLang){
        translatePage(savedLang);
    }
});