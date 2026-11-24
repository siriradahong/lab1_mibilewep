// CSR: เบราว์เซอร์ดึง JSON แล้วสร้าง HTML เอง
const list = document.getElementById('products');
const baht = new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 });

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text; // textContent ป้องกันการแทรก HTML จากข้อมูล
  return node;
}

async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const products = await response.json();

    list.replaceChildren(...products.map((p) => {
      const item = el('li', 'product');
      item.append(
        el('h2', '', p.name),
        el('p', 'spec', `${p.cpu} / RAM ${p.ram_gb} GB / ${p.storage_gb} GB`),
        el('p', 'price', baht.format(p.price)),
        el('p', 'updated', `แก้ไขล่าสุดในฐานข้อมูล: ${p.updated_at}`),
      );
      return item;
    }));
    document.getElementById('generated-at').textContent = new Date().toLocaleString('th-TH');
  } catch (error) {
    list.replaceChildren(el('li', 'error', `โหลดสินค้าไม่สำเร็จ (${error.message}) ตรวจว่าเซิร์ฟเวอร์ยังทำงานอยู่ แล้วรีโหลดหน้า`));
  }
}

loadProducts();
