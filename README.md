[![Build Status](https://api.travis-ci.org/fadhilyori/buaya-web-page.svg?branch=master)](https://travis-ci.org/fadhilyori/buaya-web-page)

# Repositori Buaya
Halaman repositori [buaya](https://buaya.klas.or.id) bisa dilihat pada halaman resmi https://buaya.klas.or.id.

## Kebutuhan

- `nodeJS`
- `npm`

## Persiapan

- Jalankan `npm install` untuk melakukan pemasangan paket-paket npm yang dibutuhkan untuk melakukan build kode sumber.


## Perintah NPM

- Gunakan perintah `npm run build` untuk build kode sumber dan meletakkannya di dalam direktori dist dan resource yang digunakan sudah di-*minified* dan siap untuk dimasukkan ke server produksi.
- `npm run serve` untuk membuka halaman web yang telah berhasil di build dari perintah *npm run build*.
- `npm run clean:dist` untuk membersihkan isi dari direktori dist.
- `npm run dev` untuk menjalankan halaman web ketika sedang melakukan perubahan atau penambahan fitur.

## Luncurkan ke Server

Arahkan webroot pada direktori dist untuk digunakan pada server produksi.
Gunakan perintah `npm run serve` untuk mencoba menjalankan halaman tanpa web server.

## Kustomisasi Website

Perubahan atau kustomisasi dapat dilakukan di direktori `src`. Tidak disarankan melakukan perubahan di direktori dist karena konten di dalam direktori dist akan berubah-ubah seiring dengan dijalankannya `npm run ...`