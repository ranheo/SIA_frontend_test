export default class Rectangle {
  draw(ctx, x, y, width, height, stroke) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = this.strokewidth;
    ctx.rect(x, y, width, height);
    ctx.stroke();
    ctx.restore();
  }

  isPointInside(ponitX, ponitY, x, y, width, height) {
    return (
      ponitX >= x && ponitX <= x + width && ponitY >= y && ponitY <= y + height
    );
  }
}
