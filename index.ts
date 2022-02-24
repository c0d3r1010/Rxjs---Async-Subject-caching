import './style.css';

import { of, map, Observable, AsyncSubject } from 'rxjs';

of('World')
  .pipe(map((name) => `Hello, ${name}!`))
  .subscribe(console.log);

// Open the console in the bottom right to see results.

const cache = {};

function getResource(url) {
  if (!cache[url]) {
    cache[url] = new AsyncSubject();
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        cache[url].next(data);
        cache[url].complete();
      });
  }

  return cache[url].asObservable();
}

const url = 'https://swapi.dev/api/people/1';

getResource(url).subscribe((data) => console.log(data));

setTimeout(() => {
  // no request is made, data is served from the AsyncSubject's cache
  getResource(url).subscribe((data) => console.log(data));
}, 3000);

document.getElementById('obi-btn').addEventListener('click', getObi);

function getObi() {
  getResource(url).subscribe((data) => console.log(data));
}
