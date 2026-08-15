/*const collection = [
  { title: "Shadow Profile", img: "/img1.jpeg" },
  { title: "Crimson Silhouette", img: "/img2.jpeg" },
  { title: "Wavelength", img: "/img3.jpeg" },
  { title: "Noir Figure", img: "/img4.jpeg" },
  { title: "Midnight Gaze", img: "/img5.jpeg" },
  { title: "Cobalt Contrast", img: "/img6.jpeg" },
  { title: "Half-Light", img: "/img7.jpeg" },
  { title: "Scarlet Frame", img: "/img8.jpeg" },
  { title: "Pale Vision", img: "/img9.jpeg" },
  { title: "Spectral Form", img: "/img10.jpeg" },
  { title: "Monochrome Motion", img: "/img11.jpeg" },
  { title: "Platinum Edge", img: "/img12.jpeg" },
  { title: "Electric Shade", img: "/img13.jpeg" },
  { title: "Veiled Light", img: "/img14.jpeg" },
  { title: "Luminous Dark", img: "/img15.jpeg" },
  { title: "Haze Portrait", img: "/img16.jpeg" },
  { title: "Glowing Contour", img: "/img17.jpeg" },
  { title: "Dark Elegance", img: "/img18.jpeg" },
  { title: "Ruby Accent", img: "/img19.jpeg" },
  { title: "Clear Gaze", img: "/img20.jpeg" },
];

export default collection;
*/
const collection = Array.from({ length: 20 }, (_, i) => ({
  title: [
    "Shadow Profile", "Crimson Silhouette", "Wavelength", "Noir Figure",
    "Midnight Gaze", "Cobalt Contrast", "Half-Light", "Scarlet Frame",
    "Pale Vision", "Spectral Form", "Monochrome Motion", "Platinum Edge",
    "Electric Shade", "Veiled Light", "Luminous Dark", "Haze Portrait",
    "Glowing Contour", "Dark Elegance", "Ruby Accent", "Clear Gaze"
  ][i],
  img: `https://picsum.photos/300/400?random=${i + 1}`
}));

export default collection;
