class Form_Element {

    /**
     * Return the name of the input
     * @param {HTMLElement} e 
     * @returns {String}
     */
    static getName(e) {
        return e.getName();
    }
    /**
     * Return the value of an input
     * @param {HTMLElement} e 
     * @returns {String}
     */
    static getValue(e) {
        return undefined;
    }
    static getInstance() {
        return undefined;
    }
}

Forms = {}
Forms["PDFTextField"] = class extends Form_Element {
    static getValue(e) {
        return e.getText() || '';
    }
    static getInstance() {
        return PDFLib.PDFTextField;
    }
};
Forms["PDFCheckBox"] = class extends Form_Element {
    static getValue(e) {
        return e.isChecked() ? '[x]' : '[_]';
    }
    static getInstance() {
        return PDFLib.PDFCheckBox;
    }
};
Forms["PDFDropdown"] = class extends Form_Element {
    static getValue(e) {
        return e.getSelected().join(';');
    }
    static getInstance() {
        return PDFLib.PDFDropdown;
    }
};
Forms["PDFOptionList"] = class extends Form_Element {
    static getValue(e) {
        return e.getSelected().join(';');
    }
    static getInstance() {
        return PDFLib.PDFOptionList;
    }
};
Forms["PDFRadioGroup"] = class extends Form_Element {
    static getValue(e) {
        return e.getSelected() || '';
    }
    static getInstance() {
        return PDFLib.PDFRadioGroup;
    }
};