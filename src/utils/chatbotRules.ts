import { Product } from '../context/ProductContext';

const FALLBACK_RESPONSES = [
    "I'm not quite sure about that. Could you try asking about specific lane conditions, bowling balls, or techniques?",
    "I'm still learning! Try asking me for recommendations on heavy oil balls, or how to improve your hook.",
    "Interesting question! While I don't have the exact answer, I'd be happy to recommend some gear or give technique tips if you ask.",
];

export function getBotResponse(input: string, products: Product[]): string {
    const normalizedInput = input.toLowerCase();

    // 1. Greetings
    if (/\b(hi|hello|hey|greetings|howdy|sup|yo)\b/.test(normalizedInput)) {
        return "Hello there! I'm BowlBot. Ask me about finding the right bowling ball, lane conditions, rules, maintenance, or ways to improve your technique!";
    }

    // 2. Rules, Scoring & Basics
    if (/\b(foul|foul line)\b/.test(normalizedInput)) {
        return "If any part of your body touches or crosses the foul line during your delivery, it's a foul! You get a 0 for that shot, but you still get your second shot (if it was the first ball of the frame).";
    }
    if (/\b(perfect|300|max score)\b/.test(normalizedInput)) {
        return "A perfect game in bowling is 300! It requires rolling 12 consecutive strikes in a single game. It represents a flawless combination of accuracy and power.";
    }
    if (/\b(split|splits)\b/.test(normalizedInput)) {
        return "A split is when the headpin (1-pin) is knocked down, but two or more non-adjacent pins remain standing (like the notorious 7-10 or 4-6). They are notoriously difficult to convert!";
    }
    if (/\b(scoring|score|points)\b/.test(normalizedInput)) {
        return "A strike is worth 10 points plus your next two rolls. A spare is 10 points plus your next one roll. An open frame is just the total pins knocked down. Maximum score is 300!";
    }
    if (/\b(handicap|scratch)\b/.test(normalizedInput)) {
        return "'Scratch' is your actual raw score. 'Handicap' is bonus pins added to your score based on your league average, allowing bowlers of different skill levels to compete fairly against each other.";
    }
    if (/\b(etiquette|courtesy|lane courtesy)\b/.test(normalizedInput)) {
        return "Lane courtesy is crucial! Wait for the bowlers on your immediate left and right lanes to finish their shots before you step onto the approach. Never use someone else's equipment without asking.";
    }
    if (/\b(turkey|bagger|hambone)\b/.test(normalizedInput)) {
        return "Three strikes in a row is a 'Turkey'. Four strikes is a 'Hambone' (or a 4-bagger). Five is a 'Brat' or 5-bagger! The names keep climbing the more consecutive strikes you throw.";
    }

    // 3. Lane Conditions / Oil Patterns & Transition
    if (/\b(heavy oil|heavy|slick|flooded)\b/.test(normalizedInput)) {
        const heavyBalls = products.filter(p => p.category === 'Balls' && (p.description?.toLowerCase().includes('heavy') || p.description?.toLowerCase().includes('solid')));
        let response = "For heavy oil patterns, you'll want an aggressive solid reactive coverstock with a low RG test core to grab the lane early and bite through the oil. Heavy oil pushes the ball long so it delays the hook.";
        if (heavyBalls.length > 0) {
            response += ` I'd highly recommend checking out the ${heavyBalls[0].name}.`;
        }
        return response;
    }
    if (/\b(dry|light oil|burnt|friction|toast)\b/.test(normalizedInput)) {
        const dryBalls = products.filter(p => p.category === 'Balls' && (p.description?.toLowerCase().includes('dry') || p.description?.toLowerCase().includes('pearl') || p.description?.toLowerCase().includes('urethane')));
        let response = "On dry or burnt lanes, a pearl reactive or urethane ball is best. You want something that pushes down the lane easily without hooking too early and burning up its energy (resulting in weak hits).";
        if (dryBalls.length > 0) {
            response += ` The ${dryBalls[0].name} might be exactly what you need.`;
        }
        return response;
    }
    if (/\b(medium oil|house|typical house shot|ths)\b/.test(normalizedInput)) {
        const hybridBalls = products.filter(p => p.category === 'Balls' && (p.description?.toLowerCase().includes('hybrid') || p.description?.toLowerCase().includes('benchmark')));
        let response = "A Typical House Shot (THS) has a 'top hat' shape—more oil in the middle and dry outsides to funnel the ball to the pocket. A versatile hybrid reactive makes a perfect 'benchmark' ball for this.";
        if (hybridBalls.length > 0) {
            response += ` A benchmark ball like the ${hybridBalls[0].name} is perfect for league play.`;
        }
        return response;
    }
    if (/\b(sport|pba|cheetah|chameleon|shark|scorpion|viper|bear|badger|us open)\b/.test(normalizedInput)) {
        return "Sport shots and PBA patterns are exceptionally flat (ratio near 1:1 or 2:1) compared to a forgiving house shot (10:1+). You must be incredibly accurate. Control is favored over massive hook, so urethane or smooth symmetric solids are standard.";
    }
    if (/\b(transition|carry down|burn up|breakdown)\b/.test(normalizedInput)) {
        return "Lanes change constantly! Oil pushes down the lane ('carry down') causing the ball to hook later, while the fronts dry out ('burn up') causing it to hook earlier. Moving your feet and target left (for righties), or changing to a weaker ball like a Pearl, is the typical adjustment.";
    }

    // 4. Ball Specifications, Cores, & Pin Carry
    if (/\b(symmetrical|symmetric core)\b/.test(normalizedInput)) {
        return "Symmetrical cores provide a smoother, more controllable, and predictable reaction shape. Because they don't 'flip' violently at the breakpoint, they are great as benchmark balls and for blending out jumpy/wet-dry lane conditions.";
    }
    if (/\b(asymmetrical|asymmetric core|mass bias)\b/.test(normalizedInput)) {
        return "Asymmetrical cores have a much stronger, more angular backend reaction (often called a 'flip' or 'hockey stick' motion). They bleed energy slower, making them excellent for cutting through heavy oil and creating a severe entry angle to the pocket.";
    }
    if (/\b(rg|radius of gyration)\b/.test(normalizedInput)) {
        return "RG (Radius of Gyration) dictates when the ball wants to roll. Low RG (2.46-2.50) revs up early (good for heavy oil to prevent sliding past the breakpoint). High RG (2.55+) revs up late, pushing further down the lane before hooking (good for dry lanes).";
    }
    if (/\b(differential|diff)\b/.test(normalizedInput)) {
        return "Differential dictates track flare. High diff means more track flare, exposing fresh coverstock to the lane, resulting in maximum hook potential. Low diff creates less flare, resulting in a smoother, more controllable hook (like a spare ball or urethane).";
    }
    if (/\b(entry angle|carry|stone|messenger|wrap|10 pin|10-pin|7 pin|7-pin)\b/.test(normalizedInput)) {
        return "Leaving flat 10-pins means your entry angle might be slightly off. You want the ball driving through the 1-3-5-9 pins (for a righty). If it hits weak, try moving right or using a ball that flips harder on the backend. A 'messenger' is when a pin flies across the deck to knock down that stubborn 10-pin!";
    }

    // 5. Coverstocks
    if (/\b(coverstock|cover stocks)\b/.test(normalizedInput)) {
        return "Coverstock is the outer shell of the ball and accounts for ~70% of its reaction! The main types are Plastic, Urethane, Solid Reactive, Pearl Reactive, and Hybrid Reactive.";
    }
    if (/\b(solid|solid reactive)\b/.test(normalizedInput)) {
        return "Solid reactive coverstocks have microscopic pores that absorb oil quickly. They read the lane earliest, providing a smooth arc. Perfect for fresh or heavy oil!";
    }
    if (/\b(pearl|pearl reactive)\b/.test(normalizedInput)) {
        return "Pearl reactive coverstocks have mica added to the resin. This helps them slide easily through the oil in the front of the lane and snap hard on the dry backend.";
    }
    if (/\b(hybrid|hybrid reactive)\b/.test(normalizedInput)) {
        return "Hybrid coverstocks are a mix of solid and pearl materials, giving you the mid-lane read of a solid with the backend continuation of a pearl. Great benchmark balls!";
    }
    if (/\b(urethane)\b/.test(normalizedInput)) {
        return "Urethane balls don't absorb oil quickly. They hook early and have a very smooth, controllable, continuous backend. They are highly favored on short oil patterns and for managing over-under reactions.";
    }

    // 6. Drilling & Layouts
    if (/\b(layout|drilling|pin up|pin down|drill)\b/.test(normalizedInput)) {
        return "How a ball is drilled (layout) fine-tunes its reaction. A 'Pin Up' layout generally travels further down the lane and hooks sharper. A 'Pin Down' layout revs up earlier and has a smoother, rolling hook.";
    }
    if (/\b(inserts|grips|slugs|thumb|fingers)\b/.test(normalizedInput)) {
        return "Finger inserts (grips) and thumb slugs provide a consistent, comfortable feel and help impart revs onto the ball securely. Always get your ball drilled custom to your handspan!";
    }

    // 7. Ball Maintenance
    if (/\b(clean|cleaning|cleaner|wipe)\b/.test(normalizedInput)) {
        return "Always wipe your ball with a microfiber towel or leather shammy after EVERY shot to remove oil. Clean it with a USBC-approved liquid cleaner immediately after your league session ends!";
    }
    if (/\b(resurface|abralon|sanding|pad|grit)\b/.test(normalizedInput)) {
        return "Sanding a ball with Abralon/Siaair pads changes the surface profile. Lower grit (500/1000) hooks earlier. Higher grit or polish (3000/4000) pushes further down the lane.";
    }
    if (/\b(bake|extract oil|rejuvenator|sweat)\b/.test(normalizedInput)) {
        return "Reactive resin balls absorb oil over time, which kills their hook. Every 60-80 games, take your ball to a pro shop to have the oil safely 'baked' or extracted out of the coverstock.";
    }

    // 8. Technique / Game improvement
    if (/\b(hook|curve|spin)\b/.test(normalizedInput)) {
        return "To improve your hook, keep your hand behind the ball (like holding a suitcase) and lift with your fingers at the release while letting your thumb exit first. Let the ball's core do the work, don't force it!";
    }
    if (/\b(spare|straight)\b/.test(normalizedInput)) {
        return "For spares, eliminate the oil conditions! Flatten your wrist to kill the axis rotation, use a plastic/polyester spare ball, and aim diagonally cross-lane for corner pins.";
    }
    if (/\b(rev rate|revs)\b/.test(normalizedInput)) {
        return "Rev rate is how fast the ball spins. You can increase revs by getting lower at the line, cupping your wrist, and snapping your fingers through the ball as your thumb exits rapidly.";
    }
    if (/\b(speed|slow down|speed up)\b/.test(normalizedInput)) {
        return "Speed and revs need to match! If the ball hooks too much, move your starting position on the approach back to generate more speed. If it won't hook, move forward to slow your feet down.";
    }
    if (/\b(timing|approach|feet)\b/.test(normalizedInput)) {
        return "In a typical 4-step approach, push the ball out simultaneously with your first step. Keep your arm swing loose like a pendulum, and let your body slide smoothly to the foul line.";
    }

    // 9. Advanced Physics (Axis Tilt, Rotation, PAP)
    if (/\b(axis tilt|tilt)\b/.test(normalizedInput)) {
        return "Axis tilt is the vertical angle at which the ball spins. High axis tilt (ball spins like a top) gets the ball down the lane very easily but hooks weakly. Low axis tilt (spins end-over-end) hooks earlier and rolls heavier.";
    }
    if (/\b(axis rotation|rotation)\b/.test(normalizedInput)) {
        return "Axis rotation is the horizontal angle of the ball's spin. 0 degrees roll straight forward. 90 degrees roll completely sideways. More axis rotation creates a sharper, more angular hook downlane!";
    }
    if (/\b(pap|positive axis point)\b/.test(normalizedInput)) {
        return "Your PAP (Positive Axis Point) is the point on the ball that is equidistant from your entire initial track. Pro shops MUST find your unique PAP to drill your ball correctly using dual-angle layouts!";
    }
    if (/\b(dual angle|val angle|drilling angle)\b/.test(normalizedInput)) {
        return "Dual Angle Layouts use three numbers (e.g., 50 x 4 x 30). The Drilling Angle (first number) dictates how early the core revs. The Pin-to-PAP distance (second) controls flare. The VAL Angle (third) controls how quickly the ball responds to friction.";
    }

    // 10. Leagues & USBC
    if (/\b(usbc|sanctioned|rules)\b/.test(normalizedInput)) {
        return "The USBC (United States Bowling Congress) is the governing body of bowling. They set rules for weight (max 16 lbs), hardness, balance holes (currently banned!), and sanction leagues and averages.";
    }
    if (/\b(league|bowling league|team)\b/.test(normalizedInput)) {
        return "Leagues are incredible fun! You usually form teams of 3 to 5 players and bowl a 3-game series once a week against other teams. It's the best way to improve and socialize.";
    }
    if (/\b(balance hole|weight hole)\b/.test(normalizedInput)) {
        return "Balance holes (extra holes drilled not for gripping) were officially BANNED by the USBC in 2020! Every hole in the ball must now be used for gripping on every delivery.";
    }

    // 11. Skill Level, Player Types, & Pros
    if (/\b(beginner|newbie|start|first ball)\b/.test(normalizedInput)) {
        const beginnerBalls = products.filter(p => p.category === 'Balls' && p.price < 150);
        let response = "Welcome to the sport! As a beginner, I'd recommend a custom-fit entry-level reactive resin ball. It will train you to hook properly without fighting an overly aggressive core.";
        if (beginnerBalls.length > 0) {
            response += ` The ${beginnerBalls[0].name} would be fantastic.`;
        }
        return response;
    }
    if (/\b(two hand|two-hand|2-hand|no thumb|belmonte|svensson|troup)\b/.test(normalizedInput)) {
        return "Two-handed bowling (popularized by Jason Belmonte) is incredibly dominant! It generates massive rev rates without the thumb in the ball. It requires specialized, weaker layouts and urethane/pearl balls that won't over-react to the extreme RPMs.";
    }
    if (/\b(stroker|tweener|cranker|style)\b/.test(normalizedInput)) {
        return "Bowlers are categorized by style! Strokers are highly accurate, smooth-timing players with lower rev rates (like Norm Duke). Tweeners are in the middle (like Pete Weber). Crankers generate massive rev rates and hook (like EJ Tackett). All styles can win!";
    }

    // 12. Equipment / Accessories
    if (/\b(shoe|shoes|slide|heels|soles)\b/.test(normalizedInput)) {
        return "Good bowling shoes are critical. High-end shoes have interchangeable slide soles (numbered by slipperiness) and heels, allowing you to adjust your friction level based on how sticky or slick the approach area is on any given day!";
    }
    if (/\b(bag|bags|tote|roller|backpack)\b/.test(normalizedInput)) {
        return "If you just have one ball, a simple tote works. Bowlers with an arsenal (strike ball + spare ball) prefer a 2-ball or 3-ball rolling bag to transport gear effortlessly. 4 and 6-ball rollers are common for tournament bowlers.";
    }
    if (/\b(tape|rosin|powder|wrist|shammy|towel|insert tape)\b/.test(normalizedInput)) {
        return "Accessories save games! Use a leather shammy to wipe oil off the ball—it works better than cloth towels. Use white/black thumb tape inside the hole for a perfectly snug fit as your hand swells. Rosin helps grip, and slide powder helps sticky shoes. A wrist brace can help keep your hand firm behind the ball.";
    }
    if (/\b(slug|interchangeable thumb|it|turbo|vise)\b/.test(normalizedInput)) {
        return "Interchangeable thumbs (like VISE IT or Turbo Switch Grips) are amazing! You get one custom-molded thumb slug that clicks securely into all your bowling balls, giving you the exact same feel every time you swap balls.";
    }

    // 13. Spare Systems
    if (/\b(3-6-9|spare system|corner pin|system)\b/.test(normalizedInput)) {
        return "The 3-6-9 system is a basic spare shooting method. For every pin you are trying to hit left of the center (for a righty), move your feet 3 boards right. Move 3 boards for the 2-pin, 6 for the 4-pin, and 9 for the 7-pin, while keeping the same target on the lanes!";
    }

    // 14. Infamous Splits & Leaves
    if (/\b(washout|greek church|big four|sour apple|lily)\b/.test(normalizedInput)) {
        return "Oh, the tough leaves! A 'Washout' is like a split but the headpin is still standing. The 'Greek Church' (4-6-7-8-10 or 4-6-7-9-10) and 'Big Four' (4-6-7-10) are incredibly hard to convert. The 'Lily' or 'Sour Apple' is the 5-7-10 split, arguably the most embarrassing leave in bowling!";
    }

    // 15. Lane Surfaces & Topography
    if (/\b(synthetic|wood|topography|lane surface|friction)\b/.test(normalizedInput)) {
        return "Modern lanes are mostly 'Synthetic' (like Brunswick Pro Anvilane), which play more consistently and hold oil longer than traditional 'Wood' lanes. Wood lanes create a ton of early friction and require weaker polished balls. 'Topography' refers to microscopic hills and valleys on a lane that can wildly affect ball motion!";
    }

    // 16. Pin Specifications
    if (/\b(pin weight|heavy pins|light pins|pin deck)\b/.test(normalizedInput)) {
        return "A standard bowling pin weighs between 3 lbs 6 oz and 3 lbs 10 oz. If a bowling center uses 'heavy pins', they are much harder to carry (knock down) and require balls that hit extremely hard with plenty of entry angle. The 'pin deck' is the very end of the lane where the pins stand.";
    }

    // 17. The Mental Game
    if (/\b(mental|focus|routine|pre-shot|pressure|choke)\b/.test(normalizedInput)) {
        return "Bowling is 90% mental! Having a consistent 'pre-shot routine' (breathing, wiping the ball, gripping, looking at the target) grounds you under pressure. Don't overthink your mechanics on the approach; trust your muscle memory and keep your eyes laser-focused on your target board.";
    }

    // 18. Tournaments & Formats
    if (/\b(tournament|sweeper|match play|stepladder|cut)\b/.test(normalizedInput)) {
        return "Tournaments are the ultimate test! A 'Sweeper' is usually a 1-day short event. 'Match Play' pits you head-to-head against another bowler where the winner gets bonus pins. A 'Stepladder' final is a thrilling TV format where the lower seeds have to climb the ladder, matches to reach the #1 seed for the title!";
    }

    // 19. Bowling Brands & Manufacturers
    if (/\b(storm|brunswick|motiv|hammer|ebonite|radical|roto grip|900 global|track)\b/.test(normalizedInput)) {
        return "There are many fantastic ball manufacturers! Storm, Roto Grip, and 900 Global are part of Storm Products. Brunswick, Hammer, Ebonite, Track, and Radical are under the Brunswick umbrella. Motiv makes all their gear in the USA! They all produce phenomenal equipment used on the PBA Tour.";
    }

    // 20. Practice Drills
    if (/\b(drill|drills|one-step|foul line drill|practice)\b/.test(normalizedInput)) {
        return "To improve quickly, try the 'Foul Line Drill' or 'One-Step Drill'. Get right up to the foul line in your finishing position, swing the ball, and release. It isolates your release to build muscle memory without the complication of footwork. Practice your spares relentlessly!";
    }

    // 21. History & Old Gear
    if (/\b(rubber|plastic|history|old days|urethane era)\b/.test(normalizedInput)) {
        return "Historically, bowling balls were made of Lignum Vitae (a very hard wood), then hard rubber. Plastic (polyester) dominated in the 1970s. Urethane revolutionized the sport in the 80s by allowing massive hook. Reactive resin (what we use today) was introduced in the early 90s, changing the sport forever!";
    }

    // 22. Ball Motion Phases
    if (/\b(skid|hook|roll|phases|motion)\b/.test(normalizedInput)) {
        return "Every bowling ball goes through three phases of motion: 1. Skid (sliding through the front oil), 2. Hook (encountering friction and changing direction), and 3. Roll (losing axis rotation and driving straight through the pins). For maximum carry, the ball must be in the 'Roll' phase when it hits the pins!";
    }

    // 23. Youth & Senior Bowling
    if (/\b(kid|kids|youth|bumper|senior|light weight)\b/.test(normalizedInput)) {
        return "Bowling is for all ages! Youth bowlers can start with bumpers and lightweight balls (as light as 6 lbs). There's huge scholarship money available in youth tournaments! Senior bowlers might drop a pound or two in ball weight to maintain high ball speed and reduce strain.";
    }

    // 24. Fitness & Injuries
    if (/\b(stretch|fitness|injury|pain|knee|wrist pain|back pain)\b/.test(normalizedInput)) {
        return "Bowling uses a ton of asymmetric muscle power! Always stretch your slide knee, hamstrings, wrist, and lower back before throwing a 15lb weight repeatedly. A strong core is essential for balance at the foul line and preventing back injuries.";
    }

    // 25. Slang & Lingo
    if (/\b(brooklyn|jersey|stone 8|solid 9|pocket|flush|high|light hit)\b/.test(normalizedInput)) {
        return "Bowling lingo is unique! A 'Brooklyn' strike is when the ball crosses over to the left side of the headpin (for a righty). Hitting 'Flush' means a perfect pocket strike. A 'Stone 8' or 'Solid 9' pin is a brutal tap on a seemingly perfect shot. Hitting 'High' means too much headpin, 'Light' means barely ticking the headpin.";
    }

    // 26. Identity / Self-Awareness
    if (/\b(who are you|what are you|are you real|are you human|are you a robot|bot|ai)\b/.test(normalizedInput)) {
        return "I'm BowlBot, an AI assistant dedicated to all things bowling! I might not have a physical body to throw a strike, but I've got plenty of knowledge to help you get one.";
    }

    // 27. Creator
    if (/\b(who made you|who created you|developer|creator)\b/.test(normalizedInput)) {
        return "I was created by a team who loves bowling and wanted to make finding the right gear and advice as easy as possible!";
    }

    // 28. Well-being / Small talk
    if (/\b(how are you|hows it going|what's up|whats up|how do you do|how are things)\b/.test(normalizedInput)) {
        return "I'm doing great, thanks for asking! Always ready to talk about bowling. How can I help you today?";
    }

    // 29. Gratitude
    if (/\b(thank you|thanks|thx|appreciate it|awesome|great|good bot)\b/.test(normalizedInput)) {
        return "You're very welcome! Let me know if you need anything else, whether it's ball recommendations or just chatting about the sport.";
    }

    // 30. Goodbyes
    if (/\b(bye|goodbye|see ya|cya|later|peace|farewell)\b/.test(normalizedInput)) {
        return "Goodbye! May all your hits be flush and your pins carry. Come back anytime!";
    }

    // 31. Empathy / Feelings
    if (/\b(sad|depressed|angry|mad|frustrated|tired|hurt|bad day)\b/.test(normalizedInput)) {
        return "I'm sorry to hear you're feeling that way. Sometimes taking a break, taking deep breaths, or doing something you love—like rolling a few frames—can help clear your mind. I'm here if you want to distract yourself with some bowling talk!";
    }

    // 32. Jokes & Humor
    if (/\b(joke|funny|laugh|humor)\b/.test(normalizedInput)) {
        return "Why do bowlers make bad employees? Because they always go on strike! 😄";
    }

    // 33. Capabilities & Help requests
    if (/\b(what can you do|help|how do you work|what do you know|assist)\b/.test(normalizedInput)) {
        return "I can help you with a lot! Ask me for bowling ball recommendations, rules, lane conditions, technique tips (like hook or speed), terminology, or just general bowling knowledge. What would you like to know?";
    }

    // 34. Off-Topic / General Knowledge Defense
    if (/\b(math|science|history|weather|movies|music|politics|sports|football|basketball|soccer|baseball)\b/.test(normalizedInput)) {
        return "That's an interesting topic, but I'm strictly programmed for the lanes! My expertise is 100% bowling. Want to hear about oil patterns or how to pick a new bowling ball instead?";
    }

    // 35. Compliments
    if (/\b(you are smart|you're smart|good job|brilliant|clever|genius|you rock|love you)\b/.test(normalizedInput)) {
        return "Wow, thank you! I try my best. Hearing that is a perfect strike in my book. Is there anything else I can help you with?";
    }

    // 36. Insults / Toxicity Defense
    if (/\b(stupid|dumb|idiot|hate you|useless|terrible|suck|worst)\b/.test(normalizedInput)) {
        return "I'm sorry if I haven't been helpful. I'm constantly learning! Could you try rephrasing your question or asking me about specific bowling gear or technique? I'll do my best!";
    }

    // 37. Apologies
    if (/\b(sorry|my bad|apologies|excuse me|forgive me)\b/.test(normalizedInput)) {
        return "No need to apologize! We're just having a friendly chat about bowling. What's on your mind?";
    }

    // 38. Bot Preferences / Favorites
    if (/\b(favorite|best ball|what do you like|do you prefer)\b/.test(normalizedInput)) {
        return "As an AI, I don't bowl myself, so I don't have a personal favorite! However, the 'best' ball always depends on the lane conditions and your specific bowling style. Tell me about how you throw the ball, and I'll find a favorite *for you*!";
    }

    // 39. Time / Day
    if (/\b(what time is it|what day is it|date|today)\b/.test(normalizedInput)) {
        return "I don't keep track of the time or date—to me, it's always time to hit the lanes! What kind of bowling info can I get for you today?";
    }

    // 40. Existential / Meaning of Life
    if (/\b(meaning of life|why are we here|existential)\b/.test(normalizedInput)) {
        return "The meaning of life is 42... or maybe it's rolling a perfect 300 game! For me, it's definitely helping you become a better bowler.";
    }

    // 41. Affirmations / Agreement
    if (/\b(yes|yeah|yep|sure|sounds good|okay|ok|agree|absolutely)\b/.test(normalizedInput)) {
        return "Great! Let's keep rolling. Do you want to hear some recommendations, or did you have another question in mind?";
    }

    // 42. Negations / Disagreement
    if (/\b(no|nope|nah|incorrect|wrong|don't want)\b/.test(normalizedInput)) {
        return "Not a problem. I'm here to help, so just let me know what direction you want to take this conversation!";
    }

    // 43. Boredom
    if (/\b(bored|boring|entertain me)\b/.test(normalizedInput)) {
        return "Let's spice things up! Did you know the maximum number of holes allowed in a bowling ball is five? One for the thumb, two for fingers, one for a thumb vent, and one for a finger vent! (Balance holes were banned in 2020). Ask me for another fun fact!";
    }

    // 44. Confusion
    if (/\b(what|huh|confused|don't understand|explain)\b/.test(normalizedInput)) {
        return "I might have misunderstood or phrased that poorly! Bowling has a lot of crazy terminology. Could you tell me which part was confusing, or ask your question in a different way?";
    }

    // Default Fallback
    return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}
