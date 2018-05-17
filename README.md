# sirti-alert

Wrapper per angular-growl-v2.

Il codice è mantenuto nel repo Bitbucket [Working+ / Common / JS::NG::SirtiAlert](https://bitbucket.org/SirtiWPL/js-ng-alert.git)
ma la distribuzione per l'aggiunta a progetti `Angular 1.x` avviene attraverso
un [repo 'locale'](http://dvmas003.ict.sirti.net:10090/git/js-ng-sirtialert.git) per
consentire lo scaricamento da Git senza la necessità di specificare credenziali d'accesso.

## Install

E' possibile aggiungere la direttiva ad un progetto `Angular 1.x` mediante `bower`:

```shell
bower install --save sirti-alert=http://dvmas003.ict.sirti.net:10090/git/js-ng-sirtialert.git
```

I file da includere nel progetto si troveranno al seguente path `bower_components/sirti-alert/dist`:

```html
<script src="bower_components/sirti-alert/dist/sirti-alert.js"></script>
```

Aggiunta componente all'app di `Angular`:

```javascript
angular.module('myApp', ['sirti-alert'])
```

E' inoltre necessario caricare le seguenti dipendenze:

```html
<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="bower_components/angular-growl-v2/build/angular-growl.css">
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-animate/angular-animate.min.js"></script>
<script src="bower_components/angular-growl-v2/build/angular-growl.js"></script>
```


## Documentation

Puoi trovare un esempio di utilizzo nei file `index.html` e `app.js` nella cartella `src`.

## Changelog

* **0.0.1**
    * prima versione stabile

## License

Copyright (c) 2017 Sirti S.p.A. - All rights reserved
