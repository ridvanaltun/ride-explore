/*
* REF -> https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html
* Bu servisin amacı -> "React Screen Nesnesi" olmadan navigation yapabilmek.
* Screen Nesnesi olmayan classlarla navigation prop paylaşılmıyor, sorun bu.
* Screen Nesnesi: Stack Navigator ve AppConteiner içinde bağlanmış olmak gerekiyor.
* Bu yöntem ile App.js üstünden serbestçe navigation yapabiliyoruz.
*/

import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
};
