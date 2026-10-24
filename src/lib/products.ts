import hamper from "@/assets/p-hamper.jpg";
import photos from "@/assets/p-photos.jpg";
import flowers from "@/assets/p-flowers.jpg";
import stationery from "@/assets/p-stationery.jpg";
import jewellery from "@/assets/p-jewellery.jpg";
import mystery from "@/assets/p-mystery.jpg";
import cosy from "@/assets/p-cosy.jpg";
import hero from "@/assets/hero.jpg";

export const OCCASIONS = ["Birthday", "Friendship", "Thank You", "Just Because", "Farewell", "Congratulations", "Apology"] as const;
export const FEELINGS = ["Loved", "Appreciated", "Surprised", "Comforted", "Celebrated", "Understood"] as const;
export const RECIPIENTS = ["Friend", "Best friend", "Partner", "Parent", "Sibling", "Roommate", "Classmate", "Other"] as const;
export const INTERESTS = ["Books & writing", "Self-care", "Food & treats", "Flowers & plants", "Jewellery & style", "Memories & photos"] as const;
export const CATEGORIES = ["Hampers", "Keepsakes", "Flowers", "Stationery", "Accessories", "Self-care", "Mystery"] as const;

export type Product = {
  id: string;
  name: string;
  price: number;
  category: (typeof CATEGORIES)[number];
  description: string;
  image: string;
  personalisable: boolean;
  photoUpload?: boolean;
  occasions: string[];
  feelings: string[];
  recipients: string[];
  interests: string[];
  sameDay?: boolean;
  popularity: number;
};

const all = [...RECIPIENTS];

export const PRODUCTS: Product[] = [
  { id: "pocket-of-sunshine", name: "Pocket of Sunshine Note Set", price: 149, category: "Stationery", image: stationery, personalisable: true, description: "Five tiny handwritten-style notes to open on hard days.", occasions: ["Just Because", "Friendship", "Apology"], feelings: ["Comforted", "Loved", "Understood"], recipients: all, interests: ["Books & writing"], sameDay: true, popularity: 9 },
  { id: "single-rose-tag", name: "Single Rose & Tag", price: 179, category: "Flowers", image: flowers, personalisable: true, description: "One dusty-pink rose, one honest line. Sometimes that's plenty.", occasions: ["Apology", "Just Because", "Thank You"], feelings: ["Loved", "Understood"], recipients: ["Partner", "Best friend", "Parent"], interests: ["Flowers & plants"], sameDay: true, popularity: 7 },
  { id: "bestie-bracelets", name: "Bestie Bead Bracelets (pair)", price: 199, category: "Accessories", image: jewellery, personalisable: true, description: "Matching bracelets spelling a word only you two understand.", occasions: ["Friendship", "Birthday", "Farewell"], feelings: ["Loved", "Celebrated"], recipients: ["Best friend", "Friend", "Sibling", "Roommate"], interests: ["Jewellery & style"], popularity: 10 },
  { id: "kind-day-mug", name: "“A Good Day” Mug", price: 249, category: "Self-care", image: cosy, personalisable: false, description: "A reminder to be gentle, in their morning chai.", occasions: ["Thank You", "Just Because", "Congratulations"], feelings: ["Appreciated", "Comforted"], recipients: all, interests: ["Self-care", "Food & treats"], sameDay: true, popularity: 8 },
  { id: "mini-mystery", name: "Mini Mystery Box", price: 299, category: "Mystery", image: mystery, personalisable: false, description: "A small sealed surprise, curated to a vibe you pick.", occasions: [...OCCASIONS], feelings: ["Surprised", "Celebrated"], recipients: all, interests: [], popularity: 6 },
  { id: "polaroid-five", name: "Five Polaroid Memories", price: 299, category: "Keepsakes", image: photos, personalisable: true, photoUpload: true, description: "Your five favourite photos, printed polaroid-style with captions.", occasions: ["Birthday", "Farewell", "Friendship"], feelings: ["Loved", "Understood"], recipients: all, interests: ["Memories & photos"], popularity: 10 },
  { id: "letter-in-wax", name: "Letter Sealed in Wax", price: 349, category: "Stationery", image: stationery, personalisable: true, description: "Your words, typed on cotton paper and sealed in berry wax.", occasions: ["Apology", "Thank You", "Farewell"], feelings: ["Understood", "Appreciated"], recipients: all, interests: ["Books & writing"], popularity: 7 },
  { id: "cosy-night-in", name: "Cosy Night-In Kit", price: 449, category: "Self-care", image: cosy, personalisable: false, description: "Candle, cookies and a mug for an evening of doing nothing.", occasions: ["Just Because", "Apology", "Thank You"], feelings: ["Comforted", "Appreciated"], recipients: ["Friend", "Roommate", "Sibling", "Partner", "Parent"], interests: ["Self-care", "Food & treats"], sameDay: true, popularity: 9 },
  { id: "blush-bouquet", name: "Blush Rose Bouquet", price: 499, category: "Flowers", image: flowers, personalisable: true, description: "Seven soft roses and baby's breath, wrapped in kraft.", occasions: ["Birthday", "Congratulations", "Apology"], feelings: ["Loved", "Celebrated"], recipients: ["Partner", "Parent", "Best friend"], interests: ["Flowers & plants"], sameDay: true, popularity: 9 },
  { id: "name-journal", name: "Embossed Name Journal", price: 549, category: "Stationery", image: stationery, personalisable: true, description: "A linen journal with their name pressed into the cover.", occasions: ["Birthday", "Congratulations", "Farewell"], feelings: ["Celebrated", "Appreciated"], recipients: all, interests: ["Books & writing"], popularity: 8 },
  { id: "memory-line", name: "Fairy-Light Memory Line", price: 649, category: "Keepsakes", image: photos, personalisable: true, photoUpload: true, description: "Six printed photos on twine with warm fairy lights.", occasions: ["Birthday", "Farewell", "Friendship"], feelings: ["Loved", "Understood", "Surprised"], recipients: ["Best friend", "Partner", "Roommate", "Sibling"], interests: ["Memories & photos"], popularity: 10 },
  { id: "sweet-hamper", name: "Little Sweet Hamper", price: 699, category: "Hampers", image: hamper, personalisable: true, description: "Chocolates, honey and a candle tucked into a woven basket.", occasions: ["Thank You", "Congratulations", "Birthday"], feelings: ["Appreciated", "Celebrated"], recipients: ["Parent", "Friend", "Classmate", "Other"], interests: ["Food & treats", "Self-care"], sameDay: true, popularity: 8 },
  { id: "signature-box", name: "The Momento Signature Box", price: 899, category: "Hampers", image: hero, personalisable: true, description: "Our wrapped keepsake box with dried roses and a note in ink.", occasions: ["Birthday", "Apology", "Just Because"], feelings: ["Loved", "Surprised"], recipients: ["Partner", "Best friend", "Parent"], interests: ["Flowers & plants", "Memories & photos"], popularity: 9 },
  { id: "name-pendant", name: "Gold-Tone Name Pendant", price: 949, category: "Accessories", image: jewellery, personalisable: true, description: "Their name in delicate script, to wear close every day.", occasions: ["Birthday", "Congratulations"], feelings: ["Loved", "Celebrated"], recipients: ["Partner", "Best friend", "Sibling", "Parent"], interests: ["Jewellery & style"], popularity: 9 },
  { id: "grand-mystery", name: "Grand Mystery Box", price: 999, category: "Mystery", image: mystery, personalisable: false, description: "Four hidden treasures, chosen around one feeling.", occasions: [...OCCASIONS], feelings: ["Surprised", "Celebrated", "Loved"], recipients: all, interests: [], popularity: 7 },
  { id: "celebration-hamper", name: "Big Celebration Hamper", price: 1499, category: "Hampers", image: hamper, personalisable: true, description: "Fine chocolates, a candle and treats for a moment worth marking.", occasions: ["Congratulations", "Birthday", "Thank You"], feelings: ["Celebrated", "Appreciated"], recipients: ["Parent", "Partner", "Other"], interests: ["Food & treats", "Self-care"], popularity: 6 },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

export const BUDGETS = [
  { id: "u199", label: "Under ₹199", min: 0, max: 199 },
  { id: "200-299", label: "₹200–₹299", min: 200, max: 299 },
  { id: "300-499", label: "₹300–₹499", min: 300, max: 499 },
  { id: "500-999", label: "₹500–₹999", min: 500, max: 999 },
  { id: "1000+", label: "₹1,000+", min: 1000, max: Infinity },
] as const;

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
