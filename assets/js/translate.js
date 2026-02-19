function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'pt',
    includedLanguages: 'pt,en,es',
    autoDisplay: false
  }, 'google_translate_element');
}

function translatePage(lang) {
  const langMap = {
    pt: 'Português',
    en: 'English',
    es: 'Español'
  };

  const tryChange = () => {
    const selectField = document.querySelector('select.goog-te-combo');
    const currentLang = document.getElementById('current-lang');

    if (selectField && currentLang) {
      selectField.value = lang;
      selectField.dispatchEvent(new Event('change'));

      currentLang.innerText = langMap[lang] || 'Português';
      localStorage.setItem('site_lang', lang);
    } else {
      setTimeout(tryChange, 300);
    }
  };

  tryChange();
}
