import RecipeList from '../../../components/Recipe/RecipeList.js';
import useObserver from '../../../hooks/useObserver.js';
import Loading from '../../../components/Loading/Loading.js';
import { RecipeProps } from './AllRecipesData.js';

interface RecipeLimitProps {
    limit?: number;
    recipes: RecipeProps[];
    fetchRecipes: () => void;
    isLoading: boolean;
    hasMore: boolean;
}

export default function AllRecipes({ limit, recipes, fetchRecipes, isLoading, hasMore }: RecipeLimitProps): JSX.Element {
    const handleObserver = async (entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting && !isLoading) {
            await fetchRecipes();
        }
    };

    const target = useObserver(handleObserver);

    return (
        <>
            <RecipeList recipes={recipes} limit={limit} />
            {limit == 3 ? (
                ''
            ) : hasMore ? (
                <div ref={target}>
                    <Loading />
                </div>
            ) : (
                <div>No more recipes to load.</div>
            )}
        </>
    );
}
