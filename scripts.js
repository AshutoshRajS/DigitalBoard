 // Get references to the canvas and its context
 const canvas = document.getElementById('canvas');
 const ctx = canvas.getContext('2d');
 const colorPicker = document.getElementById('color-picker');

 // Resize canvas to fill the screen
 canvas.width = window.innerWidth;
 canvas.height = window.innerHeight - document.getElementById('toolbar').offsetHeight;
    let tool = 'draw'; // Current tool (draw, erase, rectangle, circle)
    let drawing = false;
    let startX = 0, startY = 0;
    let color = '#000000';

    // Update color
    colorPicker.addEventListener('input', (e) => {
      color = e.target.value;
    });

    // Event listeners for tools
    document.getElementById('draw').addEventListener('click', () => (tool = 'draw'));
    document.getElementById('erase').addEventListener('click', () => (tool = 'erase'));
    document.getElementById('rectangle').addEventListener('click', () => (tool = 'rectangle'));
    document.getElementById('circle').addEventListener('click', () => (tool = 'circle'));
    document.getElementById('clear').addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

    // Drawing logic
    canvas.addEventListener('mousedown', (e) => {
      drawing = true;
      startX = e.clientX;
      startY = e.clientY - canvas.offsetTop;

      if (tool === 'erase') {
        ctx.clearRect(startX - 10, startY - 10, 20, 20);
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!drawing) return;
      const x = e.clientX;
      const y = e.clientY - canvas.offsetTop;

      if (tool === 'draw') {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
        startX = x;
        startY = y;
      } else if (tool === 'erase') {
        ctx.clearRect(x - 10, y - 10, 20, 20);
      }
    });

    canvas.addEventListener('mouseup', (e) => {
      if (!drawing) return;
      drawing = false;

      const x = e.clientX;
      const y = e.clientY - canvas.offsetTop;

      if (tool === 'rectangle') {
        const width = x - startX;
        const height = y - startY;
        ctx.fillStyle = color;
        ctx.fillRect(startX, startY, width, height);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      }
    });

    // Reset drawing state when leaving the canvas
    canvas.addEventListener('mouseleave', () => (drawing = false));