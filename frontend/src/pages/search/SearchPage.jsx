import FaviconTitle from "../../components/layout/Icon.jsx";
import faviconUrl from "../../assets/images/favicon.ico?url";

export default function Search() {


return (
    <>
        <FaviconTitle title={t("pages.searchPage")} iconHref={faviconUrl} />
    </>
)
};