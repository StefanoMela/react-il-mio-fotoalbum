# React - Il Mio Fotoalbum - Backend

Un fotografo vuole mostrare agli utenti le foto più belle che ha scattato e ci chiede di realizzare una webapp che permetta questo.

Ha bisogno di un’area di amministrazione per gestire le foto, quindi:
- vedere tutte quelle inserite (filtrabili)

- vedere i dettagli di una singola foto

- aggiungerne di nuove (con validazione)

- modificarle (con validazione)

- cancellarle

Ovviamente queste operazioni può svolgerle solo lui, quindi l’accesso alle pagine deve essere protetto da autenticazione.

Una foto contiene almeno le seguenti informazioni :
- titolo

- descrizione

- immagine (upload)

- visibile

- categorie

Una foto può essere collegata a più categorie, e una categoria può essere collegata a più foto.

Prevedere quindi anche una semplice pagina di lista, creazione e cancellazione categorie.

Deve essere presente anche una homepage pubblica, nella quale le foto (visibili) sono mostrate agli utenti.

Devono essere filtrabili per titolo.

Prevedere sempre nell’homepage pubblica un semplice form di contatto avente i campi email e messaggio.

Il click sul tasto invia farà partire una richiesta a una nuova api che salverà sul database il messaggio inviato.

L’applicazione va realizzata sfruttando React per la parte frontend e Express + Api per la parte backend.