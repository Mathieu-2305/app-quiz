// Composant réutilisable de QuizCard
import styled from "styled-components";

export default function QuizCard({ title, tags = [], imgURL, date, modified }) {
    const tagRow = tags.map((tag, i) => <Tag key={i}>{tag}</Tag>);

    // Creation de reference temporelle
    function createTimestamp(time, edited) {
        const date = new Date(Date.parse(time));
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        let type = "Crée ";
        if (edited === true) {
            type = "Modifié ";
        }

        // Creation de texte adequat
        function result(i, str) {
            const result = Math.floor(i);
            if (result > 1 && str.split("")[str.length - 1] !== "s") {
                return `il y a ${result} ${str.split(/\s/)[0]}s`;
            }
            return `il y a ${result} ${str}`;
        }

        // Calcul pour determiner l'unite temporelle adequate
        if (interval > 1) {
            return type + result(interval, "anné");
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return type + result(interval, "mois");
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return type + result(interval, "jour");
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return type + result(interval, "heure");
        }
        interval = seconds / 60;
        if (interval > 1) {
            return type + result(interval, "minute");
        }
        return type + result(seconds, "seconde");
    }

    return (
        <Container>
            <div>
                <img
                    src={imgURL}
                    alt="quiz image"
                    style={{ objectFit: "cover", height: "var(--spacing-5xl)", width: "100%", borderRadius: "var(--border-radius)" }}
                />
            </div>
            <Section>
                <h1>{title}</h1>
                <Tags>{tagRow}</Tags>
                <Timestamp>{createTimestamp(date, modified)}</Timestamp>
            </Section>
        </Container>
    );
}

// CSS
const Container = styled.div`
    padding: var(--spacing-xs);
    width: var(--spacing-9xl);
    height: auto;
    border-radius: var(--border-radius-l);
    border: 1px solid #e5e7eb;

    // Indication que l'element se trouve sous le curseur
    &:hover {
        background-color: #f3f4f6;
    }
`;

const Timestamp = styled.div`
    font-size: var(--font-size-s);
    color: var(--gray-500);
    margin-top: var(--spacing-s);
`;

const Section = styled.div`
    padding: var(--spacing-s);
`;

const Tags = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

const Tag = styled.div`
    margin: var(--spacing-2xs);
    padding: var(--spacing-2xs) var(--spacing-xs);
    color: var(--gray-500);
    font-size: var(--font-size-s);
    background-color: var(--gray-100);
    border-radius: var(--border-radius-full);
`;
