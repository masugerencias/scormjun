window.API = {
    LMSInitialize: () => {
        console.log(" Video iniciado");
        return 'true';
    },
    LMSFinish: () => {
        console.log(" LMSFinish acabado, noitificando a mi backend que se ha terminado el bvideo");

        fetch('/scorm-data', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                key: 'cmi.session.terminated',
                value: 'true',
                sessionId: 'demo'
            })
        }).then(() => {
            console.log('Notificación de finalización enviada al backend');
        }).catch(err => {
            console.error(' Error notificando finalización:', err);
        });
    },
    LMSSetValue: (key, value) => {
        return 'true';
    },

    LMSGetValue: (key) => '',
    LMSCommit: () => 'true',
    LMSGetLastError: () => '0',
    LMSGetErrorString: (code) => 'No error',
    LMSGetDiagnostic: (code) => '',
};
