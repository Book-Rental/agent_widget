import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import { FiMap } from "react-icons/fi";

type LocationCardProps = {
    title: string;
    subtitle: string;
    name: string;
    address: string;
    city?: string;
    zipCode?: string;
    onMap: () => void;
};



export const LocationCard = ({
    title,
    subtitle,
    name,
    address,
    city,
    zipCode,
    onMap
}: LocationCardProps) => {


    return (
        <div className="mt-4 rounded-2xl border bg-white p-5">
            <div className="flex justify-between">
                <div>
                    <Rb_Text className="font-semibold">
                        {title}
                    </Rb_Text>
                    <Rb_Text className="text-xs text-gray-500">
                        {subtitle}
                    </Rb_Text>
                </div>
                <button
                    onClick={onMap}
                    className="text-sm text-violet-600"
                >

                    <FiMap />

                </button>


            </div>



            <Rb_Text className="mt-4 font-semibold">
                {name}
            </Rb_Text>


            <Rb_Text className="text-sm text-gray-600">

                {address}

                <br />

                {city}

                <br />

                {zipCode}

            </Rb_Text>


        </div>

    );

};