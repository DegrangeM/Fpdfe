let parser = new DOMParser();
// doc = parser.parseFromString(odt, "application/xml");

let PDFDocument = PDFLib.PDFDocument;

let first = true;

let headers = {
    names: [],
    fields: []
}

let datas = [];

/**
 * 
 * @param {string} odt content.xml
 * @param {string} filename 
 */
function handlePdf(pdf, filename) {

    form = pdf.getForm();

    if (first) {
        handleFirst();
    }

    first = false;

    let data = [filename];

    headers.names.forEach(function (name, i) {
        let el = form.getField(name);
        if (el) {
            data.push(headers.fields[i].getValue(el));
        }
    });
    datas.push(data);

    updateButton();

}

function handleFirst() {
    let inputs = form.getFields();
    inputs.forEach(function (e) {
        let field = Object.values(Forms).filter(x => e instanceof x.getInstance());
        if (field.length) {
            headers.names.push(field[0].getName(e));
            headers.fields.push(field[0]);
        }
    });
}

function exportToCsv() {
    let e = datas;
    let n = headers.names.slice().map(x => decodeURIComponent(x.replaceAll('#', '%'))); // create a copy and fix accents
    n.unshift('Filename') // add "Filename" add the start of headers
    e.unshift(n); // put headers at the start of data needing export
    // log(CSV.serialize(e));
    downloadText('export.csv', CSV.serialize(e))
}

function updateButton() {
    let n = datas.length;

    if (n) {
        document.querySelector('.status button .imported').textContent = n > 1 ? '(' + n + ' fichiers importés)' : '(' + n + ' fichier importé)';
    }
}

function downloadText(filename, txt) {
    // Lance le téléchargement d'un fichier texte
    let el = document.createElement('a');
    el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt));
    el.setAttribute('download', filename);

    el.style.display = 'none';
    document.body.appendChild(el);

    el.click();

    document.body.removeChild(el);
}

async function handleFiles(files) {
    let teacherIndex = files.findIndex(x => x.name === '_teacher.pdf');

    if (teacherIndex !== -1) {
        files.unshift(files.splice(teacherIndex, 1)[0]);
    }

    for (var i = 0; i < files.length; i++) {
        if (files[i].type === 'application/pdf' || files[i].name.substr(-4) == '.pdf') {
            let pdfFile = await files[i].arrayBuffer();
            let pdf = await PDFDocument.load(pdfFile);
            handlePdf(pdf, files[i].name);
        } else if (files[i].type === 'application/x-zip-compressed') {
            let zip = await JSZip.loadAsync(files[i]);
            for (let [name, file] of Object.entries(zip.files)) { // Loop throught each files of the zip
                let blobFile = await file.async('blob');
                files.push(new File([blobFile], name));
            }
        }
    }
}

function log(text) {
    let p = document.createElement('pre');
    p.textContent = text;
    document.body.appendChild(p);
}

document.addEventListener('drop', async function (e) {
    e.preventDefault();

    document.body.classList.remove('hover');

    document.querySelector('.status button').classList.add('disabled');


    let files = Array.from(e.dataTransfer.files); // required because it will be lost during async

    await handleFiles(files);

    updateButton();

    if (datas.length) {
        document.querySelector('.status button').classList.remove('disabled');
    }

});

document.addEventListener('DOMContentLoaded', function (event) {
    document.querySelector('.status button').addEventListener('click', function (e) {
        if (datas.length) {
            exportToCsv();
        }
    });
});

document.addEventListener('dragover', function (e) {
    e.preventDefault();
});


document.addEventListener('dragenter', function (e) {
    document.body.classList.add('hover');
});

document.addEventListener('dragend', function (e) {
    document.body.classList.remove('hover');
});

document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('dragleave', function (e) {
        document.body.classList.remove('hover');
    });
});

window.addEventListener('load', function () {
    if (location.protocol !== 'file:') {
        navigator.serviceWorker.register('sw.js');
    }
});