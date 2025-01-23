export function CreateTexts(texts, defaultNode, maskNode) {
  texts.forEach((text) => {
    document.crea;
    const p = document.createElement("p");
    p.className = "text";
    p.textContent = text;
    defaultNode.appendChild(p);
    maskNode.appendChild(p.cloneNode(true));
  });
}
export function CreateStars(parent, template, numberRepeat) {
  const svg = template;
  for (let i = 0; i < numberRepeat; i++) {
    const clone = svg.cloneNode(true);
    parent.appendChild(clone);
  }
}
