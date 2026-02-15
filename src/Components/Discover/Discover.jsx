import React from 'react'
import "./Discover.css"
import discoverimg from "../../assets/discoverimg.png"
import card1 from "../../assets/card1.png"
import card2 from "../../assets/card2.png"
import card3 from "../../assets/card3.png"
import card4 from "../../assets/card4.png"

const Discover = () => {
    const list = [
        { id: 1, name: "Spectacles", img: card1 },
        { id: 2, name: "Sunglasses", img: card2 },
        { id: 3, name: "Contact Lenses", img: card3 },
        { id: 4, name: "Computer Glasses", img: card4 }
    ];

    // Duplicate list for infinite scroll effect
    const extendedList = [...list, ...list, ...list]; 

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isTransitioning, setIsTransitioning] = React.useState(true);
    const trackRef = React.useRef(null);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => prev + 1);
            setIsTransitioning(true);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleTransitionEnd = () => {
        // If we reached the end of the second set (visually), snap back to the first set
        // The length is list.length. We want to loop when we pass the first set.
        // Actually simplest is: if we reach distinct items count, reset to 0 without transition
        if (currentIndex >= list.length * 2) {
             setIsTransitioning(false);
             setCurrentIndex(list.length);
        }
    };

    // To prevent "flicker" on reset, we usually check index in effect, but onTransitionEnd is smoother for React
    // Let's rely on simple resetting for now if it gets too complex, but try the snap-back.
    // Logic: 
    // We start at index 0. 
    // We scroll... 1, 2, 3, 4 ... 
    // When we hit index = list.length, we are effectively showing the "copy".
    // Wait, if we only have 4 items and show 4 items, "scrolling" 1 item means showing [2,3,4,1].
    
    // Improved logic for "infinite" scroll with visible items:
    // If we want to scroll 1 by 1 endlessly:
    // We render [1,2,3,4, 1,2,3,4, 1,2,3,4]
    // Move from 0 -> 1 -> 2 -> 3 -> 4.
    // At 4, we are at the start of the 2nd copy.
    // If we reach end of 2nd copy, snap back to end of 1st copy?
    
    // Let's use a simpler check:
    React.useEffect(() => {
        if (currentIndex >= list.length * 2) {
             const timeout = setTimeout(() => {
                 setIsTransitioning(false);
                 setCurrentIndex(list.length); // Snap back to the middle copy
             }, 500); // Wait for transition to finish
             return () => clearTimeout(timeout);
        }
        if (!isTransitioning) {
            // Re-enable transition after snap back
            const timeout = setTimeout(() => {
                setIsTransitioning(true);
            }, 50);
             return () => clearTimeout(timeout);
        }
    }, [currentIndex, isTransitioning, list.length]);


    return (
        <div className='discover'>
            <div className='discoverleft'>
                <h1>Discover</h1>
                <h1>Frames <img src={discoverimg} alt="Discover" /></h1>
                <h1>By Category</h1>
            </div>
            <div className='discoverright'>
                <div 
                    className='carousel-track' 
                    style={{ 
                        transform: `translateX(-${currentIndex * (100 / extendedList.length)}%)`, 
                        transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                        width: `calc(${extendedList.length} * (100% / 3))`, // RESTORED: Exact width for 3 items
                        display: 'flex'
                    }}
                >
                    {extendedList.map((data, index) => (
                        <div 
                            className='DiscoverCard' 
                            key={`${data.id}-${index}`} 
                            style={{ 
                                width: `calc(100% / ${extendedList.length})`, // Exact share of track
                            }}
                        > 
                            <div className='cardimg'>
                                <img src={data.img} alt={data.name} />
                            </div>
                            <button>{data.name}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Discover