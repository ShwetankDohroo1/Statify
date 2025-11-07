'use client'
import DashBody from "./Dash_body";
import TextCursor from "./ui/TextAnimations/TextCursor/TextCursor";
export default function DashBoard() {
    return (
        <div className="h-full w-full">
            <DashBody />
            <TextCursor
                text="✅"
                delay={0.01}
                spacing={80}
                followMouseDirection={true}
                randomFloat={true}
                exitDuration={0.3}
                removalInterval={20}
                maxPoints={10}
            />
        </div>
    );
}
