// JavaScript untuk Navbar Toggle
document.getElementById('menu-button').addEventListener('click', function() {
  document.getElementById('navbar').classList.toggle('open');
});

const apiKey = 'chq4ZWAoZV2fCsMJteS4LSFx';

document.getElementById('uploadButton').addEventListener('click', function() {
  document.getElementById('uploadImage').click();
});

document.getElementById('uploadImage').addEventListener('change', function() {
  const file = this.files[0];
  const removeBgButton = document.getElementById('removeBgButton');
  const imageName = document.getElementById('imageName');
  const resultContainer = document.getElementById('resultContainer');
  const loadingImage = document.getElementById('loadingImage');
  const downloadLink = document.getElementById('downloadLink');

  if (!file) {
    Toastify({
      text: "Silakan pilih gambar terlebih dahulu.",
      duration: 3000,
      close: true,
      gravity: "top", // "top" or "bottom"
      position: "right", // "left", "center" or "right"
      backgroundColor: "#e74c3c", // Customize color
    }).showToast();
    removeBgButton.disabled = true; // Disable button if no file selected
  } else {
    imageName.textContent = file.name;
    removeBgButton.disabled = false; // Enable button if a file is selected
  }
});

document.getElementById('removeBgButton').addEventListener('click', function() {
  const file = document.getElementById('uploadImage').files[0];
  const resultContainer = document.getElementById('resultContainer');
  const loadingImage = document.getElementById('loadingImage');
  const downloadLink = document.getElementById('downloadLink');

  if (!file) {
    Toastify({
      text: "Silakan pilih gambar terlebih dahulu.",
      duration: 3000,
      close: true,
      gravity: "top", // "top" or "bottom"
      position: "right", // "left", "center" or "right"
      backgroundColor: "#e74c3c", // Customize color
    }).showToast();
    return; // Prevent further execution if no file is selected
  }

  const formData = new FormData();
  formData.append('image_file', file);

  // Tampilkan gambar loading
  loadingImage.classList.remove('hidden');

  resultContainer.innerHTML = ''; // Hapus konten sebelumnya
  resultContainer.appendChild(loadingImage); // Tambahkan gambar loading

  axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'blob'
    })
    .then(response => {
      const imageUrl = URL.createObjectURL(response.data);
      resultContainer.innerHTML = `<img src="${imageUrl}" alt="Hasil Gambar" style="width: 100%; height: 100%; object-fit: cover;">`;
      loadingImage.classList.add('hidden'); // Sembunyikan gambar loading
      downloadLink.href = imageUrl;
      downloadLink.classList.remove('hidden'); // Tampilkan tombol download
    })
    .catch(error => {
      console.error('Error:', error);
      resultContainer.innerHTML = '<p>Terjadi kesalahan saat mengunggah gambar.</p>';
      loadingImage.classList.add('hidden'); // Sembunyikan gambar loading
    });
});