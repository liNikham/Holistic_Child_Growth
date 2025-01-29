import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'हिंदी' },
        { code: 'mr', name: 'मराठी' },
        { code: 'bho', name: 'भोजपुरी' }
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        document.documentElement.lang = lng;
    };

    return (
        <div className="relative group">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                <FaGlobe className="text-gray-600" />
                <span className="text-gray-700">{languages.find(l => l.code === i18n.language)?.name}</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${i18n.language === lang.code ? 'text-blue-600 font-medium' : 'text-gray-700'
                            }`}
                    >
                        {lang.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSelector; 