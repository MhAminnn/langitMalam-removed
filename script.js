// JavaScript untuk Navbar Toggle
// Menambahkan event listener pada tombol menu untuk toggle navbar
document.getElementById('menu-button').addEventListener('click', function() {
  document.getElementById('navbar').classList.toggle('open'); // Menambahkan atau menghapus kelas 'open'
});

// API Key untuk remove.bg
const removeBgApiKey = 'chq4ZWAoZV2fCsMJteS4LSFx';

// Menambahkan event listener pada tombol upload untuk membuka dialog pemilihan file
document.getElementById('uploadButton').addEventListener('click', function() {
  document.getElementById('uploadImage').click(); // Memicu klik pada input file
});

// Menambahkan event listener pada input file untuk memproses file yang dipilih
document.getElementById('uploadImage').addEventListener('change', function() {
  const file = this.files[0];
  const removeBgButton = document.getElementById('removeBgButton');
  const imageName = document.getElementById('imageName');

  if (!file) {
    // Menampilkan toast jika tidak ada file yang dipilih
    Toastify({
      text: "Silakan pilih gambar terlebih dahulu.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#e74c3c",
    }).showToast();
    removeBgButton.disabled = true; // Menonaktifkan tombol removeBg
  } else {
    imageName.textContent = file.name; // Menampilkan nama file
    removeBgButton.disabled = false; // Mengaktifkan tombol removeBg
  }
});

// Menambahkan event listener pada tombol removeBg untuk menghapus background gambar
document.getElementById('removeBgButton').addEventListener('click', function() {
  const file = document.getElementById('uploadImage').files[0];
  const resultContainer = document.getElementById('resultContainer');
  const loadingImage = document.getElementById('loadingImage');
  const downloadLink = document.getElementById('downloadLink');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  if (!file) {
    // Menampilkan toast jika tidak ada file yang dipilih
    Toastify({
      text: "Silakan pilih gambar terlebih dahulu.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#e74c3c",
    }).showToast();
    return;
  }

  const formData = new FormData();
  formData.append('image_file', file);

  loadingImage.classList.remove('hidden'); // Menampilkan indikator loading

  resultContainer.innerHTML = ''; // Menghapus konten lama
  resultContainer.appendChild(loadingImage); // Menambahkan indikator loading

  // Mengirim gambar ke API remove.bg
  axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        'X-Api-Key': removeBgApiKey,
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'blob'
    })
    .then(response => {
      const imageUrl = URL.createObjectURL(response.data);
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Peningkatan kualitas gambar (contoh: memperbesar kontras)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          // Manipulasi warna (contoh: meningkatkan kontras)
          data[i] = data[i] * 1.2;     // Red
          data[i + 1] = data[i + 1] * 1.2; // Green
          data[i + 2] = data[i + 2] * 1.2; // Blue
        }

        ctx.putImageData(imageData, 0, 0);

        const enhancedImageUrl = canvas.toDataURL('image/png');
        resultContainer.innerHTML = `<img src="${enhancedImageUrl}" alt="Hasil Gambar" style="width: 100%; height: 100%; object-fit: cover;">`;
        loadingImage.classList.add('hidden'); // Menyembunyikan indikator loading
        downloadLink.href = enhancedImageUrl;
        downloadLink.classList.remove('hidden'); // Menampilkan tautan unduh
      };

      img.src = imageUrl;
    })
    .catch(error => {
      console.error('Error:', error);
      resultContainer.innerHTML = '<p>Terjadi kesalahan saat mengunggah gambar.</p>'; // Menampilkan pesan kesalahan
      loadingImage.classList.add('hidden'); // Menyembunyikan indikator loading
    });
});

// JavaScript untuk pengamatan elemen saat scroll
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM content loaded'); // Log saat DOM telah dimuat
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // Batasan visibilitas elemen untuk observer
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('Element is visible'); // Log saat elemen terlihat
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Berhenti mengamati elemen setelah terlihat
      }
    });
  }, options);

  document.querySelectorAll('.harus').forEach(element => {
    console.log('Observing element'); // Log saat mulai mengamati elemen
    observer.observe(element);
  });
});

// JavaScript untuk menampilkan elemen saat scroll
document.addEventListener('DOMContentLoaded', () => {
  let lastScrollTop = 0;
  let isScrolling;
  const elementsToShow = [
    document.querySelector('.role-p'),
    document.querySelector('.image-container')
  ];

  window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    elementsToShow.forEach(element => {
      if (currentScrollTop > lastScrollTop) {
        element.classList.add('show'); // Menambahkan kelas 'show' saat scroll turun
      } else {
        element.classList.remove('show'); // Menghapus kelas 'show' saat scroll naik
      }
    });

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // Untuk scrolling negatif atau mobile

    // Menghapus timer sebelumnya
    clearTimeout(isScrolling);

    // Menetapkan timeout untuk mendeteksi ketika scrolling berhenti
    isScrolling = setTimeout(() => {
      elementsToShow.forEach(element => {
        element.classList.add('visible'); // Menambahkan kelas 'visible' setelah scrolling berhenti
      });
    }, 150); // Menyesuaikan waktu timeout jika diperlukan
  });
});