import './homePage.css';
import Header from '../components/Header';
import LeftMenu from '../components/LeftMenu';
import Feed from '../components/Feed';
import RightMenu from '../components/RightMenu';

const HomePage = ({onlineFriendsData,currentUser,socket,arrivalMessage}) => {

    return (
        <>
        <Header socket={socket} arrivalMessage={arrivalMessage} />
        <div className="homeContainer">
            <LeftMenu />
            <Feed share={true} socket={socket}/>
            <RightMenu currentUser={currentUser} onlineFriendsData={onlineFriendsData} />
        </div>
        </>
    );
}
;
export default HomePage;
