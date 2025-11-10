import { useContext } from "react";
import { SearchContext } from "./SearchContext";
import Book from "./Book";
import book1Image from "../BookImages/book1.png";
import book2Image from "../BookImages/book2.png";
import book3Image from "../BookImages/book3.png";
import book4Image from "../BookImages/book4.png";
import book5Image from "../BookImages/book5.png";
import book6Image from "../BookImages/book6.png";
import book7Image from "../BookImages/book7.png";
import book8Image from "../BookImages/book8.png";
import book9Image from "../BookImages/book9.png";
import styles from "../Styles/Books.module.css";

export default function Books() {
  const { searchQuery } = useContext(SearchContext);

  const books = [
    {
      title: "Zana and the bumbling genie",
      description:
        "A Magical Tale of Friendship, Loyalty and Hope | Girl's Fight for Sight | Heartwarming Story of Brave Girl | Genie's Lost Magic",
      location: "Location : Block: A, Row :1",
      imageURL: book1Image,
    },
    {
      title: "Wolf King",
      description:
        "Discover the epic fantasy adventure series as Drew Ferran learns he's the last of a long line of Werewolves - and rightful ruler of a land governed by Werelords.",
      location: "Location : Block: D, Row :4",
      imageURL: book2Image,
    },
    {
      title: "The Whisperwicks: The Impossible Trials of Benjamiah Creek",
      description:
        "The spell-binding world-building of Philip Pullman with the page-turning kid appeal of Skandar and the Unicorn Thief. Discover a world of magic and secrets, friendship and unimaginable quests in this spectacular new fantasy series from the most exciting new voice in children's books.",
      location: "Location : Block: B, Row :1",
      imageURL: book3Image,
    },
    {
      title: "The Indian Stock Market Simplified",
      description: "A Beginner's Guide to Investing and Trading",
      location: "Location : Block: A, Row :3",
      imageURL: book4Image,
    },
    {
      title: "Brick by Brick",
      description:
        "From Middle-Class Roots to Entrepreneurial Success - A Roadmap for Startups, Business Growth, Leadership & Innovation | Learn to Build, Scale & Succeed in the Competitive Business World",
      location: "Location : Block: C, Row :4",
      imageURL: book5Image,
    },
    {
      title: "500 Tips for Startup Folks",
      description:
        "While there are many books that talk about broader startup topics, Mayank has distilled his learning and tried to focus on the 'how'. This startup-execution toolkit has actionable tips on 'how' things can be done faster and better. 500 Tips for Startup Folks covers more than 100 topics that are extremely relevant to startup founders, entrepreneurs and employees",
      location: "Location : Block: B, Row :1",
      imageURL: book6Image,
    },
    {
      title: "Tinkle Double Double Digest No .2 [Paperback] RAJNI THINDIATH",
      description:
        "Tinkle double double Digest no .2. It's a pack of 2 double Digest in single title. The hilarious characters like suppandi, Shikari Shambu, Kalia the Crow, makes books more interesting.",
      location: "Location : Block: D, Row :9",
      imageURL: book7Image,
    },
    {
      title: "Tinkle Double Double Digest No .98",
      description: "Children's Comic Book Series",
      location: "Location : Block: A, Row :2",
      imageURL: book8Image,
    },
    {
      title: "The Psychology of Money",
      description:
        "Timeless lessons on wealth, greed, and happiness doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people. How to manage money, invest it, and make business decisions are typically considered to involve a lot of mathematical calculations, where data and formulae tell us exactly what to do. But in the real world, people don't make financial decisions on a spreadsheet.",
      location: "Location : Block: C, Row :2",
      imageURL: book9Image,
    },
  ];

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className={styles.mainBooksContainer}>
      <h1 className={styles.heading}>Latest Collection 📚</h1>
      <div className={styles.BooksList}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => (
            <Book
              key={index}
              title={book.title}
              description={book.description}
              location={book.location}
              imageURL={book.imageURL}
            />
          ))
        ) : (
          <p className={styles.noMatch}>
            No books found matching "{searchQuery}".
          </p>
        )}
      </div>
    </section>
  );
}
