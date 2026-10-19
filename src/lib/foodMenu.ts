/**
 * Baraka Events — Food Menu 2026-27: the single source for every package shown on the site.
 *
 * Transcribed from "Baraka Food Menu 2026 - 27.pdf" (9 pages: a cover, then one page per package,
 * Menu 1 to Menu 8). The wording is the PDF's own, character for character: spellings, capitals,
 * slashes, spacing and punctuation are NOT corrected or normalised, including the places where the
 * PDF is inconsistent between menus (for example "Gulab Jamun" in Menu 1 against "Ghulab Jaman" in
 * Menu 4 to 8, "Saada Naan" against "Sada Naan", "Gajar" against "Gajor", "Kashmiri Chae" against
 * "Kashmiri Tea"). Do not tidy these here: change them in the PDF's wording only when the owner says so.
 *
 * Where the PDF wraps a line mid-item, the lines are joined with a single space; where it puts a
 * deliberate line of its own (for example the second line of a sweet-dish list) the break is kept
 * as "\n". scripts/verify-food-menu.mjs compares this data, as rendered on the page, with the PDF's
 * text layer.
 */

/** A dish in a plain-list package (Menu 4 to 8). `detail` is the PDF's parenthetical on the line below. */
export interface MenuDish {
  name: string;
  detail?: string;
}

/** A titled group in Menu 1 to 3 (for example "SWEET DISH (ANY)"). Lines are separated by "\n". */
export interface MenuSection {
  label: string;
  text: string;
}

export interface FoodPackage {
  /** 1 to 8 */
  number: number;
  /** Rupees per person, exactly as printed on the package's page */
  pricePerPerson: number;
  /** "Minimum: Persons 200" on every page */
  minimumGuests: number;
  /** Menu 1 to 3: titled sections */
  sections?: MenuSection[];
  /** Menu 4 to 8: a plain list of dishes in the PDF's order */
  dishes?: MenuDish[];
  /** The text under the "INCLUDED" heading */
  included: string;
  /** The text under the "EXCLUDED" heading */
  excluded: string;
}

/** The headings the PDF prints above the two facility paragraphs. */
export const INCLUDED_LABEL = 'INCLUDED';
export const EXCLUDED_LABEL = 'EXCLUDED';

const EXCLUDED = 'Decor, DJ, Diesel, Heating Chilling, Venue.';

/** "Wall to wall carpet/...": wording as printed on Menu 4 to 8 (Menu 1 to 3 differ slightly, see below). */
const INCLUDED_LIST =
  'Wall to wall carpet/Round Table & Banquet Chairs/Buffet Stations/Crockery Cutlery/Waiters/Lighting/Genset/25% Sofa Seats, for 20 persons Head Tables.';

export const foodPackages: FoodPackage[] = [
  {
    number: 1,
    pricePerPerson: 2600,
    minimumGuests: 200,
    sections: [
      {
        label: 'CHICKEN B.B.Q',
        text: 'Chicken Kabab/Chicken Tikka/Channey Bhaji/Halwa Puri/Pathuray/Channey/Raita/Achar',
      },
      {
        label: 'SWEET DISH (ANY)',
        // the PDF breaks this line after "Zarda" with no slash; the break is kept as printed
        text: 'Gulab Jamun/Jalebi/Kulfa/Firni/Zarda\nGur Walay Chawal/Fruit Trifle',
      },
      {
        label: 'VARIETY OF NAAN',
        text: 'Garlic Naan/Kulwanji Naan/Achari Naan/Dhaniya Naan/Saada Naan',
      },
    ],
    // Menu 1 prints "for 20 person Head Tables." (singular), unlike the other menus
    included:
      'Wall to wall carpet/Round Table & Banquet Chairs/Buffet Stations/Crockery Cutlery/Waiters/Lighting/Genset/25% Sofa Seats, for 20 person Head Tables.',
    excluded: EXCLUDED,
  },
  {
    number: 2,
    pricePerPerson: 2200,
    minimumGuests: 200,
    sections: [
      {
        label: 'CHICKEN ONE DISH',
        text: 'Chicken Qorma / Karahi\nChicken Biryani / Pulao',
      },
      {
        label: 'SWEET DISH (ANY)',
        text: 'Gulab Jamun/Jalebi/Kulfa/Firni/Zarda/Gur Walay Chawal/Fruit Trifle',
      },
      {
        label: 'VARIETY OF Live NAAN',
        text: 'Garlic Naan | Kulwanji Naan | Pudena Naan\nAchari Naan | Sada Naan',
      },
    ],
    included: INCLUDED_LIST,
    excluded: EXCLUDED,
  },
  {
    number: 3,
    pricePerPerson: 3700,
    minimumGuests: 200,
    sections: [
      {
        label: 'Mutton One Dish',
        text: 'Mutton Qorma / Karahi\nChicken Biryani / Pulao',
      },
      {
        label: 'SWEET DISH (ANY)',
        text: 'Gulab Jamun/Jalebi/Kulfa/Firni/Zarda/Gur Walay Chawal/Fruit Trifle',
      },
      {
        label: 'VARIETY OF Live NAAN',
        text: 'Garlic Naan | Kulwanji Naan | Pudena Naan\nAchari Naan | Sada Naan',
      },
    ],
    // Menu 3 prints "for 20 persons/Head Tables." (a slash) and "Decor,DJ," (no space after the first comma)
    included:
      'Wall to wall carpet/Round Table & Banquet Chairs/Buffet Stations/Crockery Cutlery/Waiters/Lighting/Genset/25% Sofa Seats, for 20 persons/Head Tables.',
    excluded: 'Decor,DJ, Diesel, Heating Chilling, Venue.',
  },
  {
    number: 4,
    pricePerPerson: 3500,
    minimumGuests: 200,
    dishes: [
      { name: 'Hot & Sour Soup' },
      { name: 'Chicken Qorma' },
      { name: 'Chicken biryani' },
      { name: 'BBQ[Tikka Boti+Kabab]' },
      { name: 'Pathooray Chanay' },
      { name: 'Variety of Salad', detail: '(Russian & Kachoomar)' },
      { name: 'Variety of Naan(Live)' },
      { name: 'Cold Drinks' },
      { name: 'Mineral Water' },
      { name: 'Mint Raita' },
      { name: 'Ghulab Jaman' },
      { name: 'Paitha Halwa/Gajar ka Halwa' },
      { name: 'Kashmiri Chae' },
    ],
    included: INCLUDED_LIST,
    excluded: EXCLUDED,
  },
  {
    number: 5,
    pricePerPerson: 5100,
    minimumGuests: 200,
    dishes: [
      { name: 'Hot & Sour Soup' },
      { name: 'Mutton Qorma' },
      { name: 'Chicken biryani' },
      { name: 'Fried Boneless Fish (Sauce)' },
      { name: 'Variety of Salad', detail: '(Russian &Kachoomar)' },
      { name: 'Chicken Kabab' },
      { name: 'Variety of Naan(Live)' },
      { name: 'Cold Drinks' },
      { name: 'Mineral Water' },
      { name: 'Mint Raita' },
      { name: 'Aloo Bukhare ki Chatni' },
      { name: 'Ghulab Jaman' },
      { name: 'Paitha Halwa/Gajar ka Halwa' },
      { name: 'Kashmiri Chae' },
    ],
    included: INCLUDED_LIST,
    excluded: EXCLUDED,
  },
  {
    number: 6,
    pricePerPerson: 4400,
    minimumGuests: 200,
    dishes: [
      { name: 'Hot & Sour Soup' },
      { name: 'Mutton Qorma' },
      { name: 'Chicken biryani' },
      { name: 'Chicken Steam Roast' },
      { name: 'Chicken Kabab' },
      { name: 'Variety of Salad', detail: '(Russian &Kachoomar)' },
      { name: 'Variety of Naan (Live)' },
      { name: 'Mint Raita' },
      { name: 'Aloo Bukhare ki Chatni' },
      { name: 'Cold Drinks' },
      { name: 'Mineral Water' },
      { name: 'Ghulab Jaman' },
      { name: 'Paitha Halwa/Gajor ka Halwa' },
      { name: 'Green Tea' },
    ],
    included: INCLUDED_LIST,
    excluded: EXCLUDED,
  },
  {
    number: 7,
    pricePerPerson: 3300,
    minimumGuests: 200,
    dishes: [
      { name: 'Hot & Sour Soup' },
      { name: 'Malai Boti' },
      { name: 'Chicken Kabab' },
      { name: 'Chicken Achari Karahi' },
      { name: 'Chanay Pathooray' },
      { name: 'Gol Gappay' },
      { name: 'Variety of Salad', detail: '(Russian &Kachoomar)' },
      { name: 'Variety of Naan (Live)' },
      { name: 'Cold Drinks' },
      { name: 'Mineral Water' },
      { name: 'Mint Raita' },
      { name: 'Ghulab Jaman/Jalebi' },
      { name: 'Paan' },
      { name: 'Green Tea' },
    ],
    included: INCLUDED_LIST,
    excluded: EXCLUDED,
  },
  {
    number: 8,
    pricePerPerson: 6700,
    minimumGuests: 200,
    dishes: [
      { name: 'Hot & Sour Soup' },
      { name: 'Prawns' },
      { name: 'Welcome Drinks' },
      { name: 'Whole Lamb Dum Pukth' },
      { name: 'Mutton Kunna' },
      { name: 'Chicken Cashew Nuts' },
      { name: 'Chicken Manchurian' },
      { name: 'Egg Fried Rice' },
      { name: 'Beef Kabab' },
      { name: 'Chicken Malai Boti' },
      { name: 'Live Tandoor', detail: '(Plain Roti, Khameeri Rori, Garlic Naan, Kalwanji & Rogni Naan)' },
      { name: 'Variety of Salad', detail: '(Russian,Beans,Plain &Kachoomar)' },
      {
        name: 'Desert Bar',
        detail: '(1 Bite Bakery Items, Lemon Tar, Chocolate Moose, Pastries,Ghulab Jamun etc)',
      },
      { name: 'Tin Cans', detail: '(Sprite, Coke, Mirinda)' },
      { name: 'Mineral Water' },
      { name: 'Kashmiri Tea' },
    ],
    included: INCLUDED_LIST,
    excluded: EXCLUDED,
  },
];

/** 2600 -> "Rs. 2,600" (manual grouping, so server and browser always agree). */
export function formatRs(amount: number): string {
  return 'Rs. ' + String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const lowestPrice = Math.min(...foodPackages.map((p) => p.pricePerPerson));
export const highestPrice = Math.max(...foodPackages.map((p) => p.pricePerPerson));
