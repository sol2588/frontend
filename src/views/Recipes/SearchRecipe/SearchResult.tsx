import styled from 'styled-components';
import RecipeList from '../../../components/Recipe/RecipeList';

interface RecipeProps {
    title: string;
    id: string;
    image: string;
    thumbnail: string;
    time: string;
    level: string;
    rate: string;
    desc: string;
    ingredients: Record<string, string | number>[];
    overview: string;
    instructions: Record<number | string, string>[];
}
interface SearchResultProps {
    recipes: RecipeProps[];
    searching: boolean;
}

export function SearchResult({ recipes, searching }: SearchResultProps) {
    return <ResultContainer>{searching ? <div>검색중입니다.</div> : <RecipeList recipes={recipes} />}</ResultContainer>;
}

const ResultContainer = styled.section``;