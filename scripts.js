 // Get references to the canvas and its context
 const canvas = document.getElementById('canvas');
 const ctx = canvas.getContext('2d');

 // Resize canvas to fill the screen
 canvas.width = window.innerWidth;
 canvas.height = window.innerHeight - document.getElementById('toolbar').offsetHeight;

 // Variables for drawing
 let drawing = false;
 let erasing = false;
 let prevX = 0;
 let prevY = 0;

 // Start drawing
 canvas.addEventListener('mousedown', (e) => {
   drawing = true;
   prevX = e.clientX;
   prevY = e.clientY - canvas.offsetTop;
 });

 // Draw or erase
 canvas.addEventListener('mousemove', (e) => {
   if (!drawing) return;
   const currX = e.clientX;
   const currY = e.clientY - canvas.offsetTop;

   ctx.strokeStyle = erasing ? 'white' : 'black';
   ctx.lineWidth = erasing ? 20 : 2;
   ctx.lineCap = 'round';

   ctx.beginPath();
   ctx.moveTo(prevX, prevY);
   ctx.lineTo(currX, currY);
   ctx.stroke();

   prevX = currX;
   prevY = currY;
 });

 // Stop drawing
 canvas.addEventListener('mouseup', () => {
   drawing = false;
   ctx.beginPath(); // Reset the path
 });

 // Stop drawing when leaving the canvas
 canvas.addEventListener('mouseleave', () => {
   drawing = false;
 });

 // Buttons functionality
 document.getElementById('draw').addEventListener('click', () => {
   erasing = false;
 });

 document.getElementById('erase').addEventListener('click', () => {
   erasing = true;
 });

 document.getElementById('clear').addEventListener('click', () => {
   ctx.clearRect(0, 0, canvas.width, canvas.height);
 });