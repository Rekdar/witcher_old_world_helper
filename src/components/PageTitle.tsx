import { useEffect } from "react";
import { conditionalRender } from "./HorizontalSpacer";
import Title from "./TitleWithUnderline";

const BASE_TITLE = "The Witcher: Old World Helper";

export default function PageTitle(
    {
        HeaderText = "Page Title",
        HeaderUnderline = true,
        ConditionalRender = conditionalRender.xs,
    }: {
        HeaderText: string;
        HeaderUnderline?: boolean;
        ConditionalRender?: conditionalRender;
    }
) {
    useEffect(() => {
        document.title = `${HeaderText} | ${BASE_TITLE}`;
        return () => { document.title = BASE_TITLE; };
    }, [HeaderText]);

    return (
        <Title
            HeaderText={HeaderText}
            HeaderUnderline={HeaderUnderline}
            ConditionalRender={ConditionalRender}
            HeaderSize={1}
        />
    );
}