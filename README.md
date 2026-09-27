# Little Note untuk Alsa

Website ucapan terima kasih statis dengan animasi ringan, login password, galeri foto, dan lightbox.

## Menjalankan lokal

Pastikan Python terpasang, lalu jalankan dari folder proyek:

```powershell
python -m http.server 8000
```

Buka `http://localhost:8000` di browser.

## Publikasi ke GitHub Pages

1. Buat repository baru di GitHub, misalnya `little-note-alsa`.
2. Dari folder proyek, jalankan:

   ```powershell
   git init
   git branch -M main
   git add .
   git commit -m "Buat website ucapan untuk Alsa"
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```

3. Di repository GitHub, buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`, lalu tekan **Save**.
6. Setelah beberapa saat, situs tersedia di:

   `https://USERNAME.github.io/NAMA-REPO/`

Folder `poto alsa` sengaja dipertahankan dengan path relatif. Jangan mengubah kapitalisasi atau nama file fotonya, karena GitHub Pages peka terhadap nama path.

## Catatan

Password `300506` adalah gerbang tampilan di sisi-klien, bukan proteksi keamanan sungguhan. Jangan gunakan pola ini untuk data pribadi atau rahasia.
