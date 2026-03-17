import CheckModerator from "@/src/components/admin/CheckModerator";
import WrapperAdmin from "@/src/components/admin/WrapperAdmin";
import Footer from "@/src/components/navigation/Footer";
import Navbar from "@/src/components/navigation/NavBar";
import UserCard from "@/src/components/user/UserCard";

export default function Admin() {
    return (
        <CheckModerator load={true} closeOnError={true}>
            <Navbar />
            <section>
                <UserCard />
                <WrapperAdmin />
            </section>
            <Footer />
        </CheckModerator >
    );
}