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
    let tempCanvas, tempCtx; // For real-time shape preview

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
    

    // Create temporary canvas for shape preview
    function createTempCanvas() {
      tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx = tempCanvas.getContext('2d');
      document.body.appendChild(tempCanvas);

      tempCanvas.style.position = 'absolute';
      tempCanvas.style.top = `${canvas.offsetTop}px`;
      tempCanvas.style.left = `${canvas.offsetLeft}px`;
      tempCanvas.style.pointerEvents = 'none';
    }

    // Remove temporary canvas
    function removeTempCanvas() {
      if (tempCanvas) {
        document.body.removeChild(tempCanvas);
        tempCanvas = null;
        tempCtx = null;
      }
    }

    // Drawing logic
    canvas.addEventListener('mousedown', (e) => {
      drawing = true;
      startX = e.clientX;
      startY = e.clientY - canvas.offsetTop;

      if (tool === 'erase') {
        ctx.clearRect(startX - 10, startY - 10, 20, 20);
      }

      if (tool === 'rectangle' || tool === 'circle') {
        createTempCanvas();
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
      } else if (tool === 'rectangle' || tool === 'circle') {
        if (tempCtx) {
          tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

          if (tool === 'rectangle') {
            tempCtx.strokeStyle = color;
            tempCtx.strokeRect(startX, startY, x - startX, y - startY);
          } else if (tool === 'circle') {
            const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
            tempCtx.beginPath();
            tempCtx.arc(startX, startY, radius, 0, 2 * Math.PI);
            tempCtx.strokeStyle = color;
            tempCtx.stroke();
          }
        }
      }
    });

    canvas.addEventListener('mouseup', (e) => {
      if (!drawing) return;
      drawing = false;

      const x = e.clientX;
      const y = e.clientY - canvas.offsetTop;

      if (tool === 'rectangle') {
        ctx.strokeStyle = color;
        ctx.strokeRect(startX, startY, x - startX, y - startY);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.stroke();
      }

      removeTempCanvas();
    });

    // Reset drawing state when leaving the canvas
    canvas.addEventListener('mouseleave', () => {
      drawing = false;
      removeTempCanvas();
    });