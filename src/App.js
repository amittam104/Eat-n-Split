import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    friendName: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    friendName: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    friendName: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [isSelected, setIsSelected] = useState(null);

  function handleOnClick() {
    setShowAddFriend((showAddFriend) => !showAddFriend);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleFriendSelected(friend) {
    setIsSelected(isSelected?.id === friend.id ? null : friend);
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === isSelected.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setIsSelected(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onHandleSelected={handleFriendSelected}
          isSelected={isSelected}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleOnClick}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {isSelected && (
        <FormSplitBill
          isSelected={isSelected}
          onSplitBill={handleSplitBill}
          key={isSelected.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onHandleSelected, isSelected }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onHandleSelected={onHandleSelected}
          isSelected={isSelected}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onHandleSelected, isSelected }) {
  const isFriendSelected = isSelected?.id === friend.id;

  return (
    <li className={isFriendSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.friendName} />
      <h3>{friend.friendName}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.friendName} {Math.abs(friend.balance)}€
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.friendName} owes you {friend.balance}€
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.friendName} are even</p>}

      <Button onClick={() => onHandleSelected(friend)}>
        {isFriendSelected ? `Close` : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [friendName, setFriendName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!friendName || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      friendName,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };

    onAddFriend(newFriend);

    setFriendName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑 Friend Name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
      />

      <label>🏞️ Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ isSelected, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoPaid, setWhoPaid] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    onSplitBill(whoPaid === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {isSelected.friendName}</h2>

      <label>💰 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🕴🏼 Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>🧑‍🤝‍🧑 {isSelected.friendName}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill</label>
      <select value={whoPaid} onChange={(e) => setWhoPaid(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{isSelected.friendName}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
