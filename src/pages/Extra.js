export const getEllipsisTxt = (str, n = 6) => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
  }
  return "";
};
export const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.log(error);
  }
};

/*This is a grant to help the poor people of the wall, they have been int he wall for years and cannot come out



The wall story
The wall story is a pretty interesting story as to why the people of the great wall are trapped in the wall and cannot come out due to them having short legs and not been able to work properly, in some cases they cannot eat



list of wall people and their history

rex - a dog like huma
boy - a boy man
ogs - they are like big people
the big footed - their feets are too big


The moment of writing this article, i know not of what is about to come, but this is a test project i hope to see bloom
*/

/*  let [cart, setCart] = useState([]);

  let localCart = localStorage.getItem("refundcart");
  let item = {
    id: grantId,
    donation_address: grant_donation_address,
    name: grant_name,
    quantity: 0,
  };
  //grantId, donation_address
  const addItem = () => {
    //create a copy of our cart state, avoid overwritting existing state
    let cartCopy = [...cart];

    //assuming we have an ID field in our item
    let { id } = item;

    //look for item in cart array
    let existingItem = cartCopy.find((cartItem) => cartItem.id == id);

    //if item already exists
    if (existingItem) {
      existingItem.quantity += item.quantity; //update item
      console.log("there already");
    } else {
      //if item doesn't exist, simply add it
      cartCopy.push(item);
    }

    //update app state
    setCart(cartCopy);

    //make cart a string and store in local space
    let stringCart = JSON.stringify(cartCopy);
    localStorage.setItem("refundcart", stringCart);
  };
  /* // const updateItem = (itemID, amount) => {};
  const removeItem = () => {
    //create cartCopy
    let cartCopy = [...cart];
    let { id } = item;

    cartCopy = cartCopy.filter((item) => item.id !== grantId);
    console.log(cartCopy, "lol");

    //update state and local
    setCart(cartCopy);

    let cartString = JSON.stringify(cartCopy);
    localStorage.setItem("refundcart", cartString);
  };
*/
//this is called on component mount
/*
  useEffect(() => {
    var localCartRefund = JSON.parse(localCart);
    //load persisted cart into state if it exists
    if (localCart) setCart(localCartRefund);
  }, []);

  */
