import { ComponentClass } from 'react';

export interface AtSkeletonProps {
  isLoaded: boolean;
  selector: string;
}

declare const AtSkeleton : ComponentClass<AtSkeletonProps>

export default AtSkeleton
