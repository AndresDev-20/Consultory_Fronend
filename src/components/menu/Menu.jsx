import "./menu.css"

function Menu({ handleMenuClick }) {

    return (
        <div className="Menu">
            <ul className="Menu__items">
                <li onClick={() => handleMenuClick(1)}>Consultorios</li>
                <li onClick={() => handleMenuClick(2)}>Item 2</li>
                <li onClick={() => handleMenuClick(3)}>Item 3</li>
                <li onClick={() => handleMenuClick(4)}>Item 4</li>
                <li onClick={() => handleMenuClick(5)}>Item 5</li>
                <li onClick={() => handleMenuClick(6)}>Item 6</li>
            </ul>
        </div>
    )
}

export default Menu;