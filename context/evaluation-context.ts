/*
 * @Author: zhangboya3 zhangboya3@xiaomi.com
 * @Date: 2025-03-18 00:47:27
 * @LastEditors: zhangboya3 zhangboya3@xiaomi.com
 * @LastEditTime: 2025-03-18 01:01:06
 * @FilePath: /yd-new/context/evaluation-context.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createContext } from "use-context-selector";
import type { UserInfo } from "@/models/evaluation";

type IExplore = {
  userInfo: UserInfo | undefined;
  setUserInfo: (item: UserInfo) => void;
};

const EvaluationContext = createContext<IExplore>({
  userInfo: undefined,
  setUserInfo: () => {},
});
export default EvaluationContext;
