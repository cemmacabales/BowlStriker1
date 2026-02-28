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

    // Default Fallback
    return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}
