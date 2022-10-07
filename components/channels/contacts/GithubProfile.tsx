import React, { ReactDOM, ReactElement, useEffect, useState } from "react";
import { Text } from "../../atoms";
import styles from "./Contact.module.scss";

export const GithubProfile = ({
	children,
	className,
	duration,
	_text = {},
	...props
}: {
	duration?: number;
	children: string;
	className?: string;
	_text?: any;
}) => {
	return <iframe src="https://github.com/MD-REHMAN" frameBorder="0" />;
};
