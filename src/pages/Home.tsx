import { useEffect, useState } from "react";
// import { addDoc } from "firebase/firestore";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../Firebase";

const Home = () => {
  const db = getFirestore(app);

  const [words, setWords] = useState<any[]>([]);
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  //   const words = [
  //     {
  //       word: "apple",
  //       meaning: "A round fruit with red or green skin and a whitish interior.",
  //     },
  //     {
  //       word: "balloon",
  //       meaning: "A flexible bag that can be inflated with air or gas.",
  //     },
  //     { word: "camera", meaning: "A device for capturing images or videos." },
  //     {
  //       word: "dream",
  //       meaning:
  //         "A series of thoughts, images, or emotions occurring during sleep.",
  //     },
  //     {
  //       word: "eagle",
  //       meaning: "A large bird of prey with a powerful build and keen vision.",
  //     },
  //     {
  //       word: "forest",
  //       meaning: "A large area covered chiefly with trees and undergrowth.",
  //     },
  //     {
  //       word: "guitar",
  //       meaning: "A stringed musical instrument played by plucking or strumming.",
  //     },
  //     { word: "house", meaning: "A building for human habitation." },
  //     { word: "island", meaning: "A piece of land surrounded by water." },
  //     {
  //       word: "jungle",
  //       meaning: "An area of dense forest, typically in a tropical region.",
  //     },
  //     {
  //       word: "kite",
  //       meaning: "A light frame covered with paper or cloth, flown in the wind.",
  //     },
  //     {
  //       word: "lemon",
  //       meaning: "A yellow, oval citrus fruit with a tangy taste.",
  //     },
  //     {
  //       word: "mountain",
  //       meaning:
  //         "A large natural elevation of the earth's surface, typically with steep sides.",
  //     },
  //     {
  //       word: "noodle",
  //       meaning:
  //         "A long, narrow piece of dough, usually made from wheat, and cooked in boiling water.",
  //     },
  //     {
  //       word: "ocean",
  //       meaning:
  //         "A vast body of salt water that covers most of the Earth's surface.",
  //     },
  //     {
  //       word: "penguin",
  //       meaning: "A flightless seabird found in the Southern Hemisphere.",
  //     },
  //     {
  //       word: "quilt",
  //       meaning:
  //         "A warm bed covering made of padding enclosed between layers of fabric.",
  //     },
  //     {
  //       word: "rocket",
  //       meaning: "A vehicle or device propelled by the force of expelled gases.",
  //     },
  //     {
  //       word: "star",
  //       meaning: "A luminous point in the night sky made up of burning gases.",
  //     },
  //     {
  //       word: "tree",
  //       meaning:
  //         "A perennial plant with an elongated stem, branches, and leaves.",
  //     },
  //     {
  //       word: "umbrella",
  //       meaning: "A portable canopy used for protection from rain or sunlight.",
  //     },
  //     {
  //       word: "vaccine",
  //       meaning:
  //         "A substance used to stimulate the production of antibodies and provide immunity to diseases.",
  //     },
  //     {
  //       word: "whale",
  //       meaning:
  //         "A large marine mammal, typically with a streamlined body and a baleen or teeth.",
  //     },
  //     {
  //       word: "xylophone",
  //       meaning:
  //         "A musical instrument consisting of a series of wooden bars struck with mallets.",
  //     },
  //     {
  //       word: "zebra",
  //       meaning: "A wild horse with black-and-white stripes, native to Africa.",
  //     },
  //     {
  //       word: "acorn",
  //       meaning: "The nut of an oak tree, typically containing a single seed.",
  //     },
  //     {
  //       word: "bird",
  //       meaning: "A warm-blooded egg-laying vertebrate with feathers and wings.",
  //     },
  //     {
  //       word: "candle",
  //       meaning: "A cylinder of wax with a wick that produces light when lit.",
  //     },
  //     {
  //       word: "daisy",
  //       meaning: "A small flower with a yellow center and white petals.",
  //     },
  //     {
  //       word: "elephant",
  //       meaning:
  //         "A large mammal with a trunk and tusks, native to Asia and Africa.",
  //     },
  //     {
  //       word: "frost",
  //       meaning:
  //         "A covering of tiny ice crystals formed on a surface when the temperature falls.",
  //     },
  //     {
  //       word: "grape",
  //       meaning: "A small, round fruit typically used to make wine or eaten raw.",
  //     },
  //     {
  //       word: "harmony",
  //       meaning:
  //         "A combination of musical notes that are pleasing when played together.",
  //     },
  //     {
  //       word: "iron",
  //       meaning:
  //         "A strong, magnetic metal often used in construction and manufacturing.",
  //     },
  //     {
  //       word: "jelly",
  //       meaning: "A sweet, gelatinous spread made from fruit juice and sugar.",
  //     },
  //     {
  //       word: "kangaroo",
  //       meaning:
  //         "A large marsupial from Australia with strong hind legs and a long tail.",
  //     },
  //     {
  //       word: "lighthouse",
  //       meaning:
  //         "A tall structure with a light at the top, used to guide ships at sea.",
  //     },
  //     {
  //       word: "moon",
  //       meaning: "The natural satellite of Earth, visible at night in the sky.",
  //     },
  //     {
  //       word: "nectar",
  //       meaning: "A sweet liquid produced by flowers that attracts pollinators.",
  //     },
  //     {
  //       word: "octopus",
  //       meaning: "A marine animal with eight arms and a bulbous body.",
  //     },
  //     {
  //       word: "piano",
  //       meaning:
  //         "A large musical instrument with keys that produce sound when struck.",
  //     },
  //     {
  //       word: "queen",
  //       meaning: "A female ruler of a country or the wife of a king.",
  //     },
  //     {
  //       word: "rainbow",
  //       meaning:
  //         "A meteorological phenomenon where light is refracted and reflected to form a spectrum of colors.",
  //     },
  //     {
  //       word: "sunset",
  //       meaning:
  //         "The time in the evening when the sun disappears below the horizon.",
  //     },
  //     {
  //       word: "turtle",
  //       meaning: "A reptile with a hard shell, often found in water.",
  //     },
  //     {
  //       word: "unicorn",
  //       meaning:
  //         "A mythical horse-like creature with a single horn on its forehead.",
  //     },
  //     {
  //       word: "vampire",
  //       meaning:
  //         "A mythological creature that feeds on blood, often depicted with fangs.",
  //     },
  //     {
  //       word: "waterfall",
  //       meaning: "A flow of water falling from a height, typically over a cliff.",
  //     },
  //     {
  //       word: "xenon",
  //       meaning:
  //         "A chemical element, a noble gas used in lighting and other technologies.",
  //     },
  //     {
  //       word: "yellow",
  //       meaning:
  //         "The color of ripe bananas or sunlight, located between green and orange in the spectrum.",
  //     },
  //     {
  //       word: "zeppelin",
  //       meaning:
  //         "A rigid airship used for travel or observation, often with a cigar-shaped body.",
  //     },
  //     {
  //       word: "actor",
  //       meaning: "A person who performs in plays, movies, or television shows.",
  //     },
  //     {
  //       word: "bricks",
  //       meaning: "Small rectangular blocks made of clay, used in construction.",
  //     },
  //     {
  //       word: "clover",
  //       meaning:
  //         "A small plant with three or four leaves, often associated with good luck.",
  //     },
  //     {
  //       word: "dance",
  //       meaning:
  //         "To move rhythmically to music, typically following a set sequence of steps.",
  //     },
  //     {
  //       word: "engine",
  //       meaning:
  //         "A machine that converts energy into mechanical force to perform work.",
  //     },
  //     {
  //       word: "firefly",
  //       meaning: "A nocturnal insect that produces light using bioluminescence.",
  //     },
  //     {
  //       word: "glove",
  //       meaning: "A garment worn on the hand to protect it or keep it warm.",
  //     },
  //     {
  //       word: "hat",
  //       meaning:
  //         "A head covering, typically made of fabric, worn for protection or fashion.",
  //     },
  //     {
  //       word: "insect",
  //       meaning: "A small arthropod animal with six legs and often wings.",
  //     },
  //     {
  //       word: "joke",
  //       meaning:
  //         "A humorous anecdote or story, often intended to provoke laughter.",
  //     },
  //     {
  //       word: "keyboard",
  //       meaning: "A set of keys used to type text or input data into a device.",
  //     },
  //     {
  //       word: "lamp",
  //       meaning: "A device that produces light, often powered by electricity.",
  //     },
  //     {
  //       word: "mango",
  //       meaning: "A tropical fruit with a sweet, juicy flesh and a large pit.",
  //     },
  //     {
  //       word: "night",
  //       meaning: "The period of darkness between sunset and sunrise.",
  //     },
  //     {
  //       word: "owl",
  //       meaning:
  //         "A nocturnal bird known for its ability to rotate its head and its hoot.",
  //     },
  //     {
  //       word: "plaza",
  //       meaning: "A public square or open space in a town or city.",
  //     },
  //     {
  //       word: "quicksand",
  //       meaning: "A trap of loose, wet sand that can engulf objects or people.",
  //     },
  //     {
  //       word: "robot",
  //       meaning:
  //         "A machine designed to carry out tasks autonomously or by remote control.",
  //     },
  //     {
  //       word: "snowflake",
  //       meaning:
  //         "A small, ice crystal that forms in the atmosphere and falls to the ground.",
  //     },
  //     {
  //       word: "trampoline",
  //       meaning:
  //         "A surface used for bouncing, often with a fabric stretched over a frame.",
  //     },
  //     {
  //       word: "violet",
  //       meaning:
  //         "A purple-colored flower or the color itself, located between blue and purple.",
  //     },
  //     {
  //       word: "walnut",
  //       meaning: "A type of tree nut with a hard shell and edible flesh.",
  //     },
  //     {
  //       word: "x-ray",
  //       meaning: "A type of electromagnetic radiation used in medical imaging.",
  //     },
  //     {
  //       word: "yodel",
  //       meaning:
  //         "A form of singing that involves rapid changes in pitch, often associated with Swiss culture.",
  //     },
  //     {
  //       word: "zombie",
  //       meaning: "A fictional undead creature often depicted in horror genres.",
  //     },
  //     {
  //       word: "aviator",
  //       meaning: "A person who operates or is trained to operate an aircraft.",
  //     },
  //     {
  //       word: "bathtub",
  //       meaning: "A large container for holding water in which people bathe.",
  //     },
  //     {
  //       word: "castle",
  //       meaning:
  //         "A large fortified building or complex, often the residence of royalty.",
  //     },
  //     {
  //       word: "dinosaur",
  //       meaning: "An extinct group of reptiles that lived millions of years ago.",
  //     },
  //     {
  //       word: "echo",
  //       meaning: "A sound that is reflected off a surface and heard again.",
  //     },
  //     {
  //       word: "feather",
  //       meaning:
  //         "A light, flat growth from a bird's skin that is used for flight or insulation.",
  //     },
  //     {
  //       word: "geography",
  //       meaning:
  //         "The study of physical features of the Earth and its atmosphere.",
  //     },
  //     {
  //       word: "hero",
  //       meaning:
  //         "A person who is admired for courage, outstanding achievements, or noble qualities.",
  //     },
  //     { word: "iceberg", meaning: "A large mass of ice floating in the ocean." },
  //     {
  //       word: "jasmine",
  //       meaning: "A fragrant white or yellow flower often used in perfumes.",
  //     },
  //     {
  //       word: "luggage",
  //       meaning:
  //         "Bags and suitcases used for storing personal belongings while traveling.",
  //     },
  //     {
  //       word: "mystic",
  //       meaning:
  //         "A person who seeks or believes in the pursuit of spiritual knowledge.",
  //     },
  //     { word: "nostalgia", meaning: "A sentimental longing for the past." },
  //     {
  //       word: "orange",
  //       meaning: "A citrus fruit with a sweet-tart flavor and orange skin.",
  //     },
  //     {
  //       word: "puzzle",
  //       meaning: "A game, problem, or toy designed to test mental skills.",
  //     },
  //     {
  //       word: "quicksilver",
  //       meaning:
  //         "Another term for mercury, the metallic element that is liquid at room temperature.",
  //     },
  //     { word: "ruby", meaning: "A red gemstone, often used in jewelry." },
  //     { word: "sunshine", meaning: "The light and warmth provided by the sun." },
  //     {
  //       word: "tiger",
  //       meaning: "A large wild cat with orange fur and black stripes.",
  //     },
  //     {
  //       word: "vortex",
  //       meaning:
  //         "A mass of spinning air or liquid, such as a whirlpool or tornado.",
  //     },
  //     {
  //       word: "whisper",
  //       meaning: "To speak very softly, using one's breath without vocal cords.",
  //     },
  //     {
  //       word: "xenophobia",
  //       meaning: "The fear or hatred of strangers or foreigners.",
  //     },
  //     {
  //       word: "yawn",
  //       meaning:
  //         "To open the mouth wide and inhale deeply, often due to tiredness or boredom.",
  //     },
  //     {
  //       word: "zeppelin",
  //       meaning: "A rigid airship used for travel or observation.",
  //     },
  //     {
  //       word: "aspirin",
  //       meaning: "A drug used to reduce pain, fever, and inflammation.",
  //     },
  //     { word: "blizzard", meaning: "A severe snowstorm with strong winds." },
  //     {
  //       word: "coconut",
  //       meaning: "A tropical fruit with a hard shell and sweet, edible interior.",
  //     },
  //     {
  //       word: "diary",
  //       meaning: "A personal record of daily events and thoughts.",
  //     },
  //     {
  //       word: "electric",
  //       meaning: "Relating to electricity, often used for power or energy.",
  //     },
  //     {
  //       word: "flicker",
  //       meaning: "To burn or shine unsteadily, often in a fluttering manner.",
  //     },
  //     {
  //       word: "giant",
  //       meaning: "An enormous creature or object, often larger than normal.",
  //     },
  //     {
  //       word: "horizon",
  //       meaning:
  //         "The line at which the Earth's surface and the sky appear to meet.",
  //     },
  //     {
  //       word: "ivory",
  //       meaning:
  //         "A hard, white substance from the tusks of elephants, often used for carving.",
  //     },
  //     {
  //       word: "lava",
  //       meaning: "Molten rock expelled by a volcano during an eruption.",
  //     },
  //     {
  //       word: "navy",
  //       meaning: "A branch of a country's armed forces that operates on the sea.",
  //     },
  //     {
  //       word: "oasis",
  //       meaning: "A fertile area in a desert where water is found.",
  //     },
  //     {
  //       word: "parrot",
  //       meaning: "A colorful bird known for its ability to mimic sounds.",
  //     },
  //     {
  //       word: "quartz",
  //       meaning:
  //         "A hard, crystalline mineral often used in jewelry or for its optical properties.",
  //     },
  //     {
  //       word: "rocket",
  //       meaning:
  //         "A device or vehicle propelled by the expulsion of gases, used for space travel or fireworks.",
  //     },
  //     {
  //       word: "starlight",
  //       meaning: "The light emitted by stars, visible from Earth.",
  //     },
  //     { word: "temple", meaning: "A religious building or place of worship." },
  //     { word: "utopia", meaning: "An ideal, perfect society or community." },
  //     {
  //       word: "vulture",
  //       meaning:
  //         "A large bird of prey that feeds on the carcasses of dead animals.",
  //     },
  //     {
  //       word: "whisk",
  //       meaning: "A kitchen utensil used for whipping, beating, or stirring.",
  //     },
  //     {
  //       word: "yarn",
  //       meaning: "A continuous strand of fibers used for knitting or weaving.",
  //       url: "https://www.youtube.com/embed/vAoB4VbhRzM?si=mNM5ZjI_Nz7NBJEC",
  //     },
  //     {
  //       word: "zipper",
  //       meaning:
  //         "A fastening device with interlocking teeth that can be opened or closed.",
  //       purchasedby: "User1",
  //     },
  //   ];

  const handleWordClick = (word: string) => {
    setExpandedWord(expandedWord === word ? null : word);
  };

  //   const addData = () => {
  //     words?.map(async (item) => {
  //     await addDoc(collection(db, "words"), item);
  //     })
  //   }

  const fetchWords = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "words"));
      const fetchedWords: any[] = [];
      querySnapshot?.forEach((doc) => {
        fetchedWords.push(doc?.data());
      });
      setWords(fetchedWords);
    } catch (error) {
      console.error("Error fetching words: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-between w-full px-10 py-4 bg-blue-800 text-white">
        <div className="text-2xl font-bold cursor-pointer">1EQ Website</div>
        <div className="text-2xl font-bold cursor-pointer">Scholarships</div>
        <div className="text-2xl font-bold cursor-pointer">SSC</div>
        <div className="text-2xl font-bold cursor-pointer">Vocab</div>
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => fetchWords()}
        >
          Refresh
        </div>
      </div>
      <div className="flex gap-x-10 gap-y-5 w-full flex-wrap mt-5 p-10 justify-center items-center">
        {loading ? (
          <div className="text-5xl">Loading...</div>
        ) : (
          <>
            {words?.map((item, index) => (
              <div
                key={index}
                className={`border-2 border-black py-2 px-4 rounded-md bg-white text-black cursor-pointer transition-all grid items-center justify-center`}
                onClick={() => handleWordClick(item?.word)}
                style={{
                  height: expandedWord === item?.word ? "auto" : "4rem",
                }}
              >
                <div>{item?.word}</div>
                {expandedWord === item?.word && (
                  <div className="mt-2 p-2 border-t-2 border-gray-300 bg-gray-100 text-gray-800">
                    <strong>Meaning:</strong> {item?.meaning}
                    {item?.purchasedby && (
                      <div className="mt-2">
                        <strong>Assigned to:</strong> {item?.purchasedby}
                      </div>
                    )}
                    {item?.url && (
                      <iframe
                        className="mt-4 h-80 w-full"
                        src={item?.url}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      ></iframe>
                    )}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
      {/* <button className="border-2 border-black bg-white p-4 rounded-lg cursor-pointer" onClick={() => addData()}>Add Data</button> */}
    </div>
  );
};

export default Home;
