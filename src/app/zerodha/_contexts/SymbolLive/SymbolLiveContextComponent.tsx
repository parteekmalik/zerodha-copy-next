import React, {
  PropsWithChildren,
  useEffect,
  useReducer
} from "react";
import { SymbolLiveContextProvider, defaultsymbolLiveContextState } from "./SymbolLive";
import { symbolLiveReducer } from "./SymbolLiveReducer";

export interface IsymbolLiveContextComponentProps extends PropsWithChildren {}

const symbolLiveContextComponent: React.FunctionComponent<
  IsymbolLiveContextComponentProps
> = (props) => {
  const { children } = props;

  const [symbolLiveState, symbolLiveDispatch] = useReducer(
    symbolLiveReducer,
    defaultsymbolLiveContextState,
  );

  useEffect(() => {}, []);

  return (
    <>
      <SymbolLiveContextProvider
        value={{ symbolLiveState, symbolLiveDispatch }}
      >
        {children}
      </SymbolLiveContextProvider>
    </>
  );
};

export default symbolLiveContextComponent;
