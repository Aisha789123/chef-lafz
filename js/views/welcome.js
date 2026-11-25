// First visit: choose the app language. Shown once; can be opened again from Settings.
import { setSetting } from '../store.js';
import { switchLang } from '../app.js';

export default function welcome(root) {
  root.innerHTML = `
    <section class="welcome">
      <img class="logo" src="icons/icon.svg" alt="">
      <h1 lang="en">Chef Lafz</h1>
      <p class="name-ur" lang="ur">شیف لفظ</p>
      <p class="line ur" lang="ur">باورچی خانے کے انگریزی الفاظ — تصویر، آواز اور اردو کے ساتھ</p>
      <p class="line" lang="en">English kitchen words — with pictures, sound and Urdu</p>
      <p class="choose"><span class="ur" lang="ur">زبان چنیں</span> · <span lang="en">Choose your language</span></p>
      <div class="choices">
        <button class="btn btn-primary ur" type="button" data-lang="ur" lang="ur">اردو</button>
        <button class="btn btn-primary" type="button" data-lang="en" lang="en">English</button>
      </div>
    </section>`;
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-lang]');
    if (!b) return;
    setSetting('welcomed', true);
    switchLang(b.dataset.lang, false);
    location.replace('#/home');
  });
  return { bare: true, title: 'Chef Lafz' };
}
