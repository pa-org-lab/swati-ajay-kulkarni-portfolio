export interface CategoryItem {
  id?: string;
  name: string;
  count: number;
  img: string;
  alt: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    name: "Portraits",
    count: 48,
    img: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=600&h=440&fit=crop&auto=format",
    alt: "Black and white portrait of a woman",
  },
  {
    name: "Weddings",
    count: 134,
    img: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&h=440&fit=crop&auto=format",
    alt: "Elegant white and pink wedding floral aisle",
  },
  {
    name: "Nature",
    count: 72,
    img: "https://images.unsplash.com/photo-1604511482975-49278f591bf4?w=600&h=440&fit=crop&auto=format",
    alt: "Golden hour landscape with grassy fields",
  },
  {
    name: "Events",
    count: 61,
    img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&h=440&fit=crop&auto=format",
    alt: "People inside a conference event hall",
  },
  {
    name: "Architecture",
    count: 39,
    img: "https://images.unsplash.com/photo-1483366774565-c783b9f70e2c?w=600&h=440&fit=crop&auto=format",
    alt: "Worm's-eye view of a concrete building",
  },
  {
    name: "Travel",
    count: 95,
    img: "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=600&h=440&fit=crop&auto=format",
    alt: "St. Peter's Basilica and bridge over the Tiber in Rome",
  },
  {
    name: "Creative",
    count: 27,
    img: "https://images.unsplash.com/photo-1599422314077-f4dfdaa4cd09?w=600&h=440&fit=crop&auto=format",
    alt: "Blue and black abstract painting",
  },
  {
    name: "Featured",
    count: 18,
    img: "https://images.unsplash.com/photo-1606143412458-acc5f86de897?w=600&h=440&fit=crop&auto=format",
    alt: "Studio portrait of a woman in a black top",
  },
];
