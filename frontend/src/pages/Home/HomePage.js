import React, { useEffect, useReducer } from "react";
import {
  getAll,
  search,
  getAllTags,
  getAllByTag,
} from "../../services/foodService";
import Thumbnail from "../../components/Thumbnails/Thumbnail";
import { useParams, Link } from "react-router-dom";
import Search from "../../components/Search/Search";
import Tags from "../../components/Tags/Tags";
import classes from "./homePage.module.css"; // optional, for styling

const initialState = { foods: [], tags: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case "FOODS_LOADED":
      return { ...state, foods: action.payload };
    case "TAGS_LOADED":
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { foods, tags } = state;
  const { searchTerm, tag } = useParams();
  //const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTags().then((tags) =>
      dispatch({ type: "TAGS_LOADED", payload: tags })
    );

    //setLoading(true);
    const load = tag
      ? getAllByTag(tag)
      : searchTerm
      ? search(searchTerm)
      : getAll();

    load.then((foods) => {
      console.log("Loaded foods:", foods);
      dispatch({ type: "FOODS_LOADED", payload: foods });
      localStorage.setItem("searchFoods", JSON.stringify(foods));
      //setLoading(false);
    });
  }, [searchTerm, tag]);

  // 🔹 Inline NotFound component
  const NotFound = ({ message, linkRoute, linkText }) => (
    <div className={classes.container}>
      <p>{"Nothing Found!"}</p>
      <Link to={"/"}>{"Reset Search"}</Link>
    </div>
  );

  // Default props for inline NotFound
  // NotFound.defaultProps = {
  //   message: "Nothing Found!",
  //   linkRoute: "/",
  //   linkText: "Go To Home Page",
  // };

  return (
    <>      
      <Search /> 
      <Tags tags={tags} />       
      {foods.length === 0 && <NotFound />}
      <Thumbnail foods={foods} />
    </>
  );
}
