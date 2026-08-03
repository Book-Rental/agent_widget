import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import { FiClock, FiMapPin } from "react-icons/fi";

type LocationStatsProps = {

loading:boolean;

distance:number|null;

eta:number|null;

};



export const LocationStats = ({
loading,
distance,
eta

}:LocationStatsProps)=>{


return (

<div className="grid grid-cols-2 gap-3 mt-4">


<div className="rounded-xl bg-gray-50 p-3">

<FiMapPin/>

<Rb_Text>
{
loading
?"Loading"
:`${distance?.toFixed(1)} km`
}
</Rb_Text>


</div>



<div className="rounded-xl bg-gray-50 p-3">

<FiClock/>

<Rb_Text>
{
loading
?"Loading"
:`${eta} mins`
}
</Rb_Text>


</div>


</div>

);

};