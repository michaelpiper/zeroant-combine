import React from 'react';
import { Box, H2, H5, Illustration, Text } from '@adminjs/design-system';
import { styled } from '@adminjs/design-system/styled-components';
import { useTranslation } from 'adminjs';
const pageHeaderHeight = 284;
const pageHeaderPaddingY = 74;
const pageHeaderPaddingX = 250;
export const DashboardHeader = () => {
    const { translateMessage } = useTranslation();
    return (React.createElement(Box, { position: "relative", overflow: "hidden", "data-css": "default-dashboard" },
        React.createElement(Box, { position: "absolute", top: 50, left: -10, opacity: [0.2, 0.4, 1], animate: true },
            React.createElement(Illustration, { variant: "Rocket" })),
        React.createElement(Box, { position: "absolute", top: -70, right: -15, opacity: [0.2, 0.4, 1], animate: true },
            React.createElement(Illustration, { variant: "Moon" })),
        React.createElement(Box, { bg: "grey100", height: pageHeaderHeight, py: pageHeaderPaddingY, px: ['default', 'lg', pageHeaderPaddingX] },
            React.createElement(Text, { textAlign: "center", color: "white" },
                React.createElement(H2, null, translateMessage('welcomeOnBoard_title')),
                React.createElement(Text, { opacity: 0.8 }, translateMessage('welcomeOnBoard_subtitle'))))));
};
const boxes = ({ translateMessage }) => [];
const Card = styled(Box) `
  display: ${({ flex }) => (flex !== undefined && flex !== null ? 'flex' : 'block')};
  color: ${({ theme }) => theme.colors.grey100};
  height: 100%;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.space.md};
  transition: all 0.1s ease-in;
  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.primary100};
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;
Card.defaultProps = {
    variant: 'container',
    boxShadow: 'card'
};
export const Dashboard = () => {
    const { translateMessage } = useTranslation();
    return (React.createElement(Box, null,
        React.createElement(DashboardHeader, null),
        React.createElement(Box, { mt: ['xl', 'xl', '-100px'], mb: "xl", mx: [0, 0, 0, 'auto'], px: ['default', 'lg', 'xxl', '0'], position: "relative", flex: true, flexDirection: "row", flexWrap: "wrap", width: [1, 1, 1, 1024] }, boxes({ translateMessage }).map((box, index) => (React.createElement(Box, { key: index, width: [1, 1 / 2, 1 / 2, 1 / 3], p: "lg" },
            React.createElement(Card, { as: "a", href: box.href, target: "_blank" },
                React.createElement(Text, { textAlign: "center" },
                    React.createElement(Illustration, { variant: box.variant, width: 100, height: 70 }),
                    React.createElement(H5, { mt: "lg" }, box.title),
                    React.createElement(Text, null, box.subtitle)))))))));
};
export default Dashboard;
//# sourceMappingURL=dashboard.js.map