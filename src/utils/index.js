import {Fragment} from "react";

export const asFormData = (obj) => {
  const f = new FormData();
  for (let [key, value] of Object.entries(obj)) {
    f.append(key, value);
  }

  return f;
}

export const readAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    }

    reader.onerror = reject;
    reader.readAsDataURL(file);
  })
}

export const breakLine = (str) => {
  if (!str)
    return '';
  if (Array.isArray(str)) {
    str = str.map(x => isNull(x) ? '' : x.toString()).join('');
  }

  return str.split(/\n|<br\/?>/g).map((x, i) => <Fragment key={i}>{x}<br/></Fragment>);
}

export const isSameAddress = (a = '', b = '') => {
  if (!a || !b) {
    return false;
  }

  return a.toString().toLowerCase() === b.toString().toLowerCase();
}

export const isNull = (v) => {
  return typeof v === 'undefined' || v === null;
}

export const dismissEvent = (e) => {
  if (e && e.target) {
    e.target.blur();
  }
}
