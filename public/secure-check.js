// แสดงว่าหน้านี้อยู่ใน Secure Context หรือไม่ (จำเป็นสำหรับกล้องและตำแหน่งในบทที่ 6 และ 8)
const status = document.getElementById('secure-status');
if (status) {
  const secure = window.isSecureContext;
  status.textContent = `${location.protocol}//${location.host} · isSecureContext = ${secure}` +
    (secure ? ' (ใช้กล้องและตำแหน่งได้)' : ' (กล้องและตำแหน่งจะถูกปิด ต้องเปิดผ่าน HTTPS หรือ localhost)');
  status.className = secure ? 'secure yes' : 'secure no';
}
